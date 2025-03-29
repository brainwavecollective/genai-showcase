
import { supabase } from "@/integrations/supabase/client";

export const createTestUsers = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("create-test-users", {
      method: "POST"
    });
    
    if (error) {
      console.error("Error creating test users:", error);
      return { success: false, error };
    }
    
    console.log("Test users creation results:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Exception creating test users:", error);
    return { success: false, error };
  }
};
