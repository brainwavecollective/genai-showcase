
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up Supabase client with service role key for admin privileges
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define our test users
const testUsers = [
  {
    email: "test-admin-1@cu.edu",
    password: "password123", // In a real app, use a secure password
    name: "Larissa Thompson",
    role: "admin",
    avatar_url: "https://i.pravatar.cc/150?img=1"
  },
  {
    email: "test-student-1@cu.edu",
    password: "password123",
    name: "Alex Rodriguez",
    role: "creator",
    avatar_url: "https://i.pravatar.cc/150?img=2"
  },
  {
    email: "test-student-2@cu.edu",
    password: "password123",
    name: "Maya Patel",
    role: "creator",
    avatar_url: "https://i.pravatar.cc/150?img=3"
  },
  {
    email: "test-student-3@cu.edu",
    password: "password123",
    name: "Jordan Lee",
    role: "creator",
    avatar_url: "https://i.pravatar.cc/150?img=4"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const results = [];
    
    // Process each test user
    for (const user of testUsers) {
      console.log(`Creating user: ${user.email}`);
      
      // Check if the user already exists
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("email")
        .eq("email", user.email)
        .maybeSingle();
      
      if (existingUser) {
        console.log(`User ${user.email} already exists, skipping`);
        results.push({ email: user.email, status: "already exists" });
        continue;
      }
      
      // Step 1: Create the auth user
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true // Auto-confirm email
      });
      
      if (authError) {
        console.error(`Error creating auth user ${user.email}:`, authError);
        results.push({ email: user.email, status: "error", error: authError.message });
        continue;
      }
      
      // Step 2: Add to users table with all user details
      const { error: userError } = await supabaseAdmin
        .from("users")
        .insert({
          id: authUser.user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar_url: user.avatar_url,
          status: 'approved'
        });
      
      if (userError) {
        console.error(`Error adding ${user.email} to users table:`, userError);
        results.push({ email: user.email, status: "error", error: userError.message });
        continue;
      }
      
      results.push({ email: user.email, status: "created", id: authUser.user.id });
      console.log(`Successfully created user: ${user.email}`);
    }
    
    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
