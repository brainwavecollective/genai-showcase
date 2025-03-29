
import { User } from '.';
import { Database } from '../integrations/supabase/types';

// Define RPC function parameters and responses
export type RPCFunctions = Database['public']['Functions'];
export type UpdateUserStatusParams = { p_user_id: string; p_status: string };
export type UpdateUserStatusResponse = User[];
export type RPCFunctionNames = 
  | "update_user_status" 
  | "check_is_admin" 
  | "get_all_users" 
  | "get_user_by_id" 
  | "insert_user" 
  | "is_admin" 
  | "is_admin_secure" 
  | "is_admin_user";
