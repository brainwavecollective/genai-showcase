
// This file defines TypeScript types for Supabase RPC functions

import { User } from '.';

// Response type for the get_user_by_id RPC function
export interface GetUserByIdResponse extends User {}

// Response type for the update_user_status RPC function
export interface UpdateUserStatusResponse extends User {}
