// src/components/ui/fluid-cursor.tsx
import React, { useRef, useEffect } from "react";

interface FluidCursorProps {
  className?: string;
  config?: {
    SIM_RESOLUTION?: number;
    DYE_RESOLUTION?: number;
    DENSITY_DISSIPATION?: number;
    VELOCITY_DISSIPATION?: number;
    PRESSURE?: number;
    PRESSURE_ITERATIONS?: number;
    CURL?: number;
    SPLAT_RADIUS?: number;
    SPLAT_FORCE?: number;
    SHADING?: boolean;
    COLOR_UPDATE_SPEED?: number;
    PAUSED?: boolean;
  };
}

export function FluidCursor({
  className = "",
  config = {},
}: FluidCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Default configuration
    const defaultConfig = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 3.5,
      VELOCITY_DISSIPATION: 2,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 20,
      CURL: 3,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLOR_UPDATE_SPEED: 10,
      PAUSED: false,
    };

    // Merge default with provided configuration
    const mergedConfig = { ...defaultConfig, ...config };

    // Pointer class for tracking cursor/touch
    class Pointer {
      id: number = -1;
      texcoordX: number = 0;
      texcoordY: number = 0;
      prevTexcoordX: number = 0;
      prevTexcoordY: number = 0;
      deltaX: number = 0;
      deltaY: number = 0;
      down: boolean = false;
      moved: boolean = false;
      color: [number, number, number] = [0, 0, 0];
    }

    const pointers = [new Pointer()];
    let lastTime = Date.now();
    let colorUpdateTime = 0;

    // Set up WebGL context
    const gl = canvas.getContext("webgl", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Resize handler
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    // Create shader programs
    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const blurVertexShader = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform vec2 texelSize;

      void main () {
          vUv = aPosition * 0.5 + 0.5;
          float offset = 1.33333333;
          vL = vUv - texelSize * offset;
          vR = vUv + texelSize * offset;
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const blurShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform sampler2D uTexture;

      void main () {
          vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
          sum += texture2D(uTexture, vL) * 0.35294117;
          sum += texture2D(uTexture, vR) * 0.35294117;
          gl_FragColor = sum;
      }
    `);

    const copyShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `);

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          
          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `;

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;

      void main () {
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          gl_FragColor = dissipation * texture2D(uSource, coord);
      }
    `);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;

          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }

          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `);

    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;

          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `);

    const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    function compileShader(type: number, source: string): WebGLShader {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null!;
      }

      return shader;
    }

    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
      const program = gl.createProgram()!;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        return null!;
      }

      return program;
    }

    // Create shader programs
    const copyProgram = createProgram(baseVertexShader, copyShader);
    const displayProgram = createProgram(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, displayShaderSource));
    const splatProgram = createProgram(baseVertexShader, splatShader);
    const advectionProgram = createProgram(baseVertexShader, advectionShader);
    const divergenceProgram = createProgram(baseVertexShader, divergenceShader);
    const curlProgram = createProgram(baseVertexShader, curlShader);
    const vorticityProgram = createProgram(baseVertexShader, vorticityShader);
    const pressureProgram = createProgram(baseVertexShader, pressureShader);
    const gradientSubtractProgram = createProgram(baseVertexShader, gradientSubtractShader);

    // Extract uniform locations
    function createProgramInfo(program: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation> = {};
      const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      
      for (let i = 0; i < numUniforms; i++) {
        const info = gl.getActiveUniform(program, i)!;
        uniforms[info.name] = gl.getUniformLocation(program, info.name)!;
      }
      
      return {
        program,
        uniforms,
        bind() {
          gl.useProgram(program);
        }
      };
    }

    const copyProgramInfo = createProgramInfo(copyProgram);
    const displayProgramInfo = createProgramInfo(displayProgram);
    const splatProgramInfo = createProgramInfo(splatProgram);
    const advectionProgramInfo = createProgramInfo(advectionProgram);
    const divergenceProgramInfo = createProgramInfo(divergenceProgram);
    const curlProgramInfo = createProgramInfo(curlProgram);
    const vorticityProgramInfo = createProgramInfo(vorticityProgram);
    const pressureProgramInfo = createProgramInfo(pressureProgram);
    const gradientSubtractProgramInfo = createProgramInfo(gradientSubtractProgram);

    // Create vertex buffer
    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      return (target?: any, clear = false) => {
        if (target == null) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        
        if (clear) {
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        
        // Draw a quad
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    // Create framebuffers
    function createFBO(width: number, height: number, format: number) {
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, gl.FLOAT, null);

      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width,
        height,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        }
      };
    }

    function createDoubleFBO(width: number, height: number, format: number) {
      let fbo1 = createFBO(width, height, format);
      let fbo2 = createFBO(width, height, format);

      return {
        width,
        height,
        texelSizeX: 1.0 / width,
        texelSizeY: 1.0 / height,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        }
      };
    }

    function resizeCanvas() {
      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    function getResolution(resolution: number) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      
      if (aspectRatio < 1) {
        aspectRatio = 1.0 / aspectRatio;
      }
      
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    }

    // Initialize framebuffers
    let dye: any, velocity: any, divergence: any, curl: any, pressure: any;

    function initFramebuffers() {
      const simRes = getResolution(mergedConfig.SIM_RESOLUTION);
      const dyeRes = getResolution(mergedConfig.DYE_RESOLUTION);

      dye = createDoubleFBO(dyeRes.width, dyeRes.height, gl.RGBA);
      velocity = createDoubleFBO(simRes.width, simRes.height, gl.RGBA);
      divergence = createFBO(simRes.width, simRes.height, gl.RGBA);
      curl = createFBO(simRes.width, simRes.height, gl.RGBA);
      pressure = createDoubleFBO(simRes.width, simRes.height, gl.RGBA);
    }

    initFramebuffers();

    // Simulation functions
    function calcDeltaTime() {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      return Math.min(dt, 0.016);
    }

    function updateColors(dt: number) {
      if (!mergedConfig.COLORFUL) return;
      
      colorUpdateTime += dt * mergedConfig.COLOR_UPDATE_SPEED;
      if (colorUpdateTime >= 1) {
        colorUpdateTime = 0;
        pointers.forEach(p => {
          p.color = generateColor();
        });
      }
    }

    function applyInputs() {
      if (mergedConfig.PAUSED) return;
      
      pointers.forEach(p => {
        if (p.moved) {
          p.moved = false;
          applyPointerMovement(p);
        }
      });
    }

    function step(dt: number) {
      gl.disable(gl.BLEND);
      
      // Curl
      curlProgramInfo.bind();
      gl.uniform2f(curlProgramInfo.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgramInfo.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);
      
      // Vorticity
      vorticityProgramInfo.bind();
      gl.uniform2f(vorticityProgramInfo.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgramInfo.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgramInfo.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgramInfo.uniforms.curl, mergedConfig.CURL);
      gl.uniform1f(vorticityProgramInfo.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();
      
      // Divergence
      divergenceProgramInfo.bind();
      gl.uniform2f(divergenceProgramInfo.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgramInfo.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);
      
      // Clear pressure
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      // Pressure
      pressureProgramInfo.bind();
      gl.uniform2f(pressureProgramInfo.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgramInfo.uniforms.uDivergence, divergence.attach(0));
      
      for (let i = 0; i < mergedConfig.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgramInfo.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }
      
      // Gradient subtract
      gradientSubtractProgramInfo.bind();
      gl.uniform2f(gradientSubtractProgramInfo.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientSubtractProgramInfo.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgramInfo.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();
      
      // Advection
      advectionProgramInfo.bind();
      gl.uniform2f(advectionProgramInfo.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(advectionProgramInfo.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgramInfo.uniforms.uSource, velocity.read.attach(1));
      gl.uniform1f(advectionProgramInfo.uniforms.dt, dt);
      gl.uniform1f(advectionProgramInfo.uniforms.dissipation, mergedConfig.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();
      
      gl.uniform1i(advectionProgramInfo.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgramInfo.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProgramInfo.uniforms.dissipation, mergedConfig.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render() {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      
      drawDisplay();
    }

    function drawDisplay() {
      displayProgramInfo.bind();
      gl.uniform1i(displayProgramInfo.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    // Interaction functions
    function applyPointerMovement(pointer: Pointer) {
      const dx = pointer.deltaX * mergedConfig.SPLAT_FORCE;
      const dy = pointer.deltaY * mergedConfig.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
      splatProgramInfo.bind();
      gl.uniform1i(splatProgramInfo.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgramInfo.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgramInfo.uniforms.point, x, y);
      gl.uniform3f(splatProgramInfo.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProgramInfo.uniforms.radius, mergedConfig.SPLAT_RADIUS / 100);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgramInfo.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgramInfo.uniforms.color, color[0] * 0.3, color[1] * 0.3, color[2] * 0.3);
      blit(dye.write);
      dye.swap();
    }

    function generateColor(): [number, number, number] {
      const h = Math.random();
      const s = 1.0;
      const v = 1.0;
      
      let r, g, b;
      
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      
      switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
        default: r = 0, g = 0, b = 0;
      }
      
      return [r, g, b];
    }

    function multipleSplats(amount: number) {
      for (let i = 0; i < amount; i++) {
        const color = generateColor();
        const x = Math.random();
        const y = Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        splat(x, y, dx, dy, color);
      }
    }

    // Input handling
    function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number) {
      pointer.id = id;
	  pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    }

    function updatePointerMoveData(pointer: Pointer, posX: number, posY: number) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

    function correctDeltaX(delta: number) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }

    function correctDeltaY(delta: number) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    // Event handlers
    function handleMouseDown(e: MouseEvent) {
      const pointer = pointers[0];
      const posX = scaleByPixelRatio(e.offsetX);
      const posY = scaleByPixelRatio(e.offsetY);
      updatePointerDownData(pointer, -1, posX, posY);
    }

    function handleMouseMove(e: MouseEvent) {
      const pointer = pointers[0];
      if (!pointer.down) return;
      const posX = scaleByPixelRatio(e.offsetX);
      const posY = scaleByPixelRatio(e.offsetY);
      updatePointerMoveData(pointer, posX, posY);
    }

    function handleMouseUp() {
      pointers[0].down = false;
    }

    function handleTouchStart(e: TouchEvent) {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        if (i >= pointers.length) pointers.push(new Pointer());
        
        const posX = scaleByPixelRatio(touches[i].pageX);
        const posY = scaleByPixelRatio(touches[i].pageY);
        updatePointerDownData(pointers[i], touches[i].identifier, posX, posY);
      }
    }

    function handleTouchMove(e: TouchEvent) {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers[i];
        const posX = scaleByPixelRatio(touches[i].pageX);
        const posY = scaleByPixelRatio(touches[i].pageY);
        updatePointerMoveData(pointer, posX, posY);
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers.find(p => p.id === touches[i].identifier);
        if (pointer) pointer.down = false;
      }
    }

    function scaleByPixelRatio(value: number) {
      const pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(value * pixelRatio);
    }

    // Animation loop
    function animate() {
      if (resizeCanvas()) {
        initFramebuffers();
      }
      
      const dt = calcDeltaTime();
      updateColors(dt);
      applyInputs();
      step(dt);
      render();
      requestAnimationFrame(animate);
    }

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Start with some initial splats
    multipleSplats(Math.random() * 20 + 5);
    animate();

    // Clean up
    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className={`fluid-cursor-canvas ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    />
  );
}