
import { User } from '.';
import { Database } from '../integrations/supabase/types';

// Define RPC function parameters and responses
export type RPCFunctions = Database['public']['Functions'];
export type UpdateUserStatusParams = { p_user_id: string; p_status: string };
export type UpdateUserStatusResponse = User[];

