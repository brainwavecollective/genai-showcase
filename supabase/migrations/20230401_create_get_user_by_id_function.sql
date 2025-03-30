
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
      'updated_at', u.updated_at,
      'bio', u.bio,
      'website', u.website,
      'linkedin', u.linkedin,
      'twitter', u.twitter,
      'github', u.github,
      'instagram', u.instagram,
      'is_last_name_public', u.is_last_name_public,
      'is_avatar_public', u.is_avatar_public,
      'is_bio_public', u.is_bio_public,
      'is_email_public', u.is_email_public,
      'is_website_public', u.is_website_public,
      'is_linkedin_public', u.is_linkedin_public,
      'is_twitter_public', u.is_twitter_public,
      'is_github_public', u.is_github_public,
      'is_instagram_public', u.is_instagram_public
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
