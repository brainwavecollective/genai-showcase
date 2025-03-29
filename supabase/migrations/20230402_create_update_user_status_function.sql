
-- Create a secure function to update user status without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.update_user_status(
  p_user_id UUID,
  p_status TEXT
)
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_user public.users;
BEGIN
  UPDATE public.users
  SET status = p_status::public.user_status
  WHERE id = p_user_id
  RETURNING * INTO updated_user;
  
  RETURN NEXT updated_user;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_user_status(UUID, TEXT) TO authenticated;
