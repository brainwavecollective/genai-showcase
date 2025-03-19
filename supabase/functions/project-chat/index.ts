
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    // Check for API key in request
    const apiKey = req.headers.get('apikey');
    if (!apiKey) {
      console.error('No API key provided in request headers');
      throw new Error('Authentication required: No API key provided');
    }

    const { message, projectContext } = await req.json();

    if (!openAIApiKey) {
      console.error('OpenAI API key is not configured in environment');
      throw new Error('OpenAI API key is not configured in environment');
    }

    console.log('Received request for project chat:', { message, projectContext: projectContext ? 'provided' : 'not provided' });

    const systemPrompt = `
You are a helpful AI assistant that provides information about student projects in the ATLAS Institute's Generative AI course at CU Boulder.
${projectContext ? `Here is information about the current project: ${projectContext}` : ''}
Your goal is to help users understand the projects, provide summaries, explain concepts, and give additional context.
Base your responses on the project information provided. If you don't have enough information, suggest what might be relevant.
Keep your responses concise, informative, and student-friendly.
    `;

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
