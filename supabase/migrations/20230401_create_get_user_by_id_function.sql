
-- Create a secure function to get user by ID without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_by_id(user_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_data jsonb;
BEGIN
  SELECT
    jsonb_build_object(
      'id', u.id,
      'email', u.email,
      'name', u.name,
      'role', u.role,
      'first_name', u.first_name,
      'last_name', u.last_name,
      'course', u.course,
      'semester', u.semester,
      'notes', u.notes,
      'status', u.status,
      'avatar_url', u.avatar_url,
      'created_at', u.created_at,
      'updated_at', u.updated_at
    ) INTO user_data
  FROM
    public.users u
  WHERE
    u.id = user_id;
    
  RETURN user_data;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_by_id(UUID) TO authenticated;
