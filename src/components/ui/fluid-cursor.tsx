
import React, { useRef, useEffect } from 'react';

// Interface for config options
interface FluidCursorConfig {
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  SPLAT_RADIUS: number;
  SPLAT_FORCE: number;
  CURL: number;
  SHADING: boolean;
  COLORFUL: boolean; // Add the COLORFUL property
}

interface FluidCursorProps {
  config?: Partial<FluidCursorConfig>;
}

export const FluidCursor: React.FC<FluidCursorProps> = ({ config = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Default configuration with sensible defaults
  const defaultConfig: FluidCursorConfig = {
    DENSITY_DISSIPATION: 0.98,
    VELOCITY_DISSIPATION: 0.99,
    SPLAT_RADIUS: 0.3,
    SPLAT_FORCE: 6000,
    CURL: 30,
    SHADING: true,
    COLORFUL: false, // Default to false
  };

  // Merge provided config with defaults
  const mergedConfig: FluidCursorConfig = {
    ...defaultConfig,
    ...config
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Setup canvas context and fluid simulation
    const setCanvasDimensions = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reset simulation if needed when dimensions change
    };

    // Initialize the canvas dimensions
    setCanvasDimensions();

    // Handle window resize
    window.addEventListener('resize', setCanvasDimensions);

    // Placeholder for actual WebGL fluid simulation
    // In a real implementation, this would initialize shaders, setup buffers, etc.
    const initFluidSimulation = () => {
      // Implement fluid dynamics simulation here
      console.log("Fluid simulation initialized with config:", mergedConfig);
    };

    initFluidSimulation();

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, [mergedConfig]);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none"
      style={{ 
        opacity: 0.8, 
        background: 'transparent' 
      }}
    />
  );
};
