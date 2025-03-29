
import { Database } from '../integrations/supabase/types';

// Define RPC function parameters and responses
export type RPCFunctions = Database['public']['Functions'];
export type RPCFunctionNames = keyof RPCFunctions;

// Export function parameter and return types directly from the Database type
// This allows TypeScript to automatically update these when Supabase types are regenerated
export type GetAllUsersFunction = RPCFunctions['get_all_users'];
export type GetUserByIdFunction = RPCFunctions['get_user_by_id'];
export type UpdateUserStatusFunction = RPCFunctions['update_user_status'];
export type IsAdminFunction = RPCFunctions['is_admin'];
