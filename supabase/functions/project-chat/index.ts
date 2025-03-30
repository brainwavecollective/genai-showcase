
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const CHAT_LIMIT_PER_DAY = 100;
const CHAT_COUNTER_KEY = "daily_chat_count";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 second delay between retries

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to wait
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to call Anthropic API with retry logic
async function callAnthropicWithRetry(systemPrompt: string, message: string, retries = MAX_RETRIES) {
  let lastError = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt + 1}/${retries} after delay...`);
        await sleep(RETRY_DELAY_MS * Math.pow(2, attempt)); // Exponential backoff
      }
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicApiKey!,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Check if it's an overloaded error, which we'll retry
        if (data.error?.type === "overloaded_error") {
          console.log('Anthropic API overloaded, will retry...');
          lastError = new Error(`Anthropic API error: ${data.error?.message || JSON.stringify(data.error) || 'Overloaded'}`);
          continue; // Try again
        }
        
        // For other errors, throw immediately
        throw new Error(`Anthropic API error: ${data.error?.message || JSON.stringify(data.error) || 'Unknown error'}`);
      }
      
      return data.content[0].text;
    } catch (error) {
      lastError = error;
      // Only retry on overloaded errors or network issues
      if (!error.message.includes('Overloaded') && !error.message.includes('network')) {
        throw error; // Don't retry other types of errors
      }
    }
  }
  
  // If we've exhausted retries
  throw lastError || new Error('Failed to get response from Anthropic API after multiple retries');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase admin client to fetch project data and manage chat limits
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if we've exceeded daily chat limit
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const { data: counterData } = await supabase
      .from('storage')
      .select('value')
      .eq('key', `${CHAT_COUNTER_KEY}_${today}`)
      .maybeSingle();
    
    const currentCount = counterData?.value || 0;
    
    if (currentCount >= CHAT_LIMIT_PER_DAY) {
      return new Response(
        JSON.stringify({
          response: "The number of available free chats for today has been exhausted. Please try again tomorrow or contact daniel@brainwavecollective.ai with any needs."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { message, projectContext } = await req.json();

    if (!anthropicApiKey) {
      console.error('Anthropic API key is not configured in environment');
      throw new Error('Anthropic API key is not configured in environment');
    }

    console.log('Received request for project chat:', { message, projectContext });

    // Fetch public projects with improved logging
    const { data: publicProjects, error: projectsError } = await supabase
      .from('project_details')
      .select('*')
      .eq('is_private', false);
    
    if (projectsError) {
      console.error('Error fetching public projects:', projectsError);
      throw new Error(`Error fetching public projects: ${projectsError.message}`);
    }
    
    // Log projects for debugging
    console.log(`Successfully fetched ${publicProjects?.length || 0} public projects`);
    
    // Format public projects for the system prompt - ensuring ONLY real project data is used
    let projectsInfo = "";
    if (publicProjects && publicProjects.length > 0) {
      projectsInfo = publicProjects.map(project => {
        return `
          Project: ${project.title || 'Untitled Project'}
          Description: ${project.description || 'No description provided'}
          Tags: ${project.tag_names?.join(', ') || 'No tags'}
          Creator: ${project.creator_name || 'Unknown'}
          Created: ${project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown date'}
        `;
      }).join('\n');
    } else {
      projectsInfo = 'Currently there are no public projects available in the showcase.';
    }
    
    // About page information for context - Expanded with more detailed content
    const aboutPageInfo = `
      About the CU Boulder ATLAS Institute Generative AI Showcase:
      
      Project Origin:
      This showcase platform was developed during a Spring 2025 workshop led by Daniel Ritchie as part of 
      Larissa Schwartz's Generative AI course at the ATLAS Institute, CU Boulder. The platform serves as 
      both a functional showcase and a teaching tool, demonstrating key concepts in web development, user 
      experience design, and content management. The workshop explored innovative approaches to rapid 
      prototyping and development, focusing on the integration of aesthetic and functional elements. 
      This platform was created as a demonstration tool for the workshop to illustrate application 
      development concepts in practice.
      
      Educational Context:
      As part of Professor Schwartz's Generative AI curriculum, this project provided students with 
      hands-on experience in:
      - Collaborative development environments
      - User interface design for creative portfolios
      - Integration of generative AI components in web applications
      - Exploration of iterative design processes using low-code/no-code tools
      - Background understanding of vibe coding and related experiences
      
      Student Work Usage Policy:
      All student projects featured on this platform remain the intellectual property of their respective 
      creators. Students are wholly responsible for the content they upload to this showcase platform. 
      This platform is provided for demonstration purposes of related technologies only, and content is 
      not reviewed for accuracy or appropriateness.
      
      Important note: This showcase platform is independently developed and maintained by 
      Daniel Ritchie as an external instructor for the workshop. It is not officially affiliated with or 
      endorsed by the University of Colorado Boulder or the ATLAS Institute.
      
      By submitting work to this platform, students:
      - Retain full ownership of their intellectual property
      - Grant display rights for educational and demonstration purposes
      - Acknowledge responsibility for the content they upload
      - Have direct control over their content through individual login accounts, including the ability to edit or remove their work at any time
      
      Contact Information:
      For questions regarding this platform: Daniel Ritchie (daniel@brainwavecollective.ai)
      For questions about the Generative AI course at ATLAS Institute: Larissa Schwartz (Larissa.Schwartz@colorado.edu)
    `;

    const systemPrompt = `
      You are a helpful AI assistant specifically for the CU Boulder ATLAS Institute Generative AI Showcase platform.
      ${aboutPageInfo}
      
      Here is information about the public projects in the showcase:
      ${projectsInfo}
      
      ${projectContext && projectContext !== "not provided" ? `Additional information about the current project: ${projectContext}` : ''}
      
      Your role is to:
      1. Help users understand the showcase platform and its projects
      2. Provide information about specific projects when asked
      3. Explain concepts related to generative AI in the context of these student projects
      4. Guide users in exploring the showcase effectively
      
      Only discuss topics directly related to this showcase platform, its projects, or relevant educational concepts.
      If asked about unrelated topics, politely redirect the conversation to the showcase platform.
      
      Keep your responses concise, informative, and student-friendly.
      
      IMPORTANT: Only discuss projects that are actually in the database as shown in the project information provided above.
      If you don't know details about a specific project or if the showcase doesn't currently have many projects,
      be honest about this rather than inventing fictional projects or details.
    `;

    console.log('System prompt created with project information');

    // Call Anthropic API with retry logic
    const aiResponse = await callAnthropicWithRetry(systemPrompt, message);
    console.log('Sending AI response:', aiResponse.substring(0, 100) + '...');

    // Increment the chat counter
    await supabase
      .from('storage')
      .upsert({ 
        key: `${CHAT_COUNTER_KEY}_${today}`, 
        value: currentCount + 1 
      });

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in project chat function:', error);
    
    // Provide a more helpful error message to the user
    let errorMessage = error.message;
    if (error.message.includes('Overloaded')) {
      errorMessage = "The AI service is currently experiencing high demand. Please try again in a moment.";
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      retry: error.message.includes('Overloaded') // Flag to indicate if frontend should retry
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
