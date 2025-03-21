
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const CHAT_LIMIT_PER_DAY = 100;
const CHAT_COUNTER_KEY = "daily_chat_count";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    if (!openAIApiKey) {
      console.error('OpenAI API key is not configured in environment');
      throw new Error('OpenAI API key is not configured in environment');
    }

    console.log('Received request for project chat:', { message, projectContext });

    // Fetch public projects for context - ALWAYS do this regardless of whether projectContext is provided
    const { data: publicProjects, error: projectsError } = await supabase
      .from('project_details')
      .select('*')
      .eq('is_private', false);
    
    if (projectsError) {
      console.error('Error fetching public projects:', projectsError);
    }
    
    // Format public projects for the system prompt
    const projectsInfo = publicProjects?.map(project => {
      return `
        Project: ${project.title}
        Description: ${project.description || 'No description provided'}
        Tags: ${project.tag_names?.join(', ') || 'No tags'}
        Creator: ${project.creator_name || 'Unknown'}
        Created: ${project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown date'}
      `;
    }).join('\n') || 'No public projects available';
    
    console.log(`Found ${publicProjects?.length || 0} public projects for context`);
    
    // About page information for context
    const aboutPageInfo = `
      About the CU Boulder ATLAS Institute Generative AI Showcase:
      This showcase platform was developed during a Spring 2025 workshop led by Daniel Ritchie as part of 
      Larissa Schwartz's Generative AI course at the ATLAS Institute, CU Boulder. The platform serves as 
      both a functional showcase and a teaching tool, demonstrating key concepts in web development, user 
      experience design, and content management. The workshop explored innovative approaches to rapid 
      prototyping and development, focusing on the integration of aesthetic and functional elements.
      
      As part of Professor Schwartz's Generative AI curriculum, this project provided students with 
      hands-on experience in collaborative development environments, user interface design for creative portfolios,
      integration of generative AI components in web applications, exploration of iterative design processes using 
      low-code/no-code tools, and background understanding of vibe coding and related experiences.
      
      All student projects featured on this platform remain the intellectual property of their respective creators.
      Students retain full ownership of their intellectual property, grant display rights for educational 
      and demonstration purposes, acknowledge responsibility for the content they upload, and have direct control 
      over their content through individual login accounts, including the ability to edit or remove their work at any time.
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
      Base your responses on the information provided. If you don't have enough information, suggest what might be relevant.
    `;

    console.log('System prompt created with project information');

    // Make the API request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const aiResponse = data.choices[0].message.content;
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
