export type UserRole = 'admin' | 'creator' | 'visitor' | 'member'; // Added 'member' to match the options
export type UserStatus = 'pending_review' | 'approved' | 'denied' | 'active' | 'suspended'; // Added 'active' and 'suspended' to match the UI options

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  course?: string;
  semester?: string;
  notes?: string;
  status?: UserStatus;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy field
  name?: string;
  // Bio and social fields
  bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  // Privacy settings
  is_last_name_public?: boolean;
  is_avatar_public?: boolean;
  is_bio_public?: boolean;
  is_email_public?: boolean;
  is_website_public?: boolean;
  is_linkedin_public?: boolean;
  is_twitter_public?: boolean;
  is_github_public?: boolean;
  is_instagram_public?: boolean;
}

export interface MediaItem {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  media_type: 'image' | 'video' | 'link' | 'document' | 'text' | string; // Added generic string to handle db values
  media_url: string;
  thumbnail_url?: string;
  creator_id: string;
  creator_name?: string;
  creator_avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  creator_id: string;
  creator_name?: string;
  is_private: boolean;
  cover_image_url?: string;
  created_at?: string;
  updated_at?: string;
  tag_ids?: string[];
  tag_names?: string[];
  // Add mediaItems for compatibility with existing code
  mediaItems?: MediaItem[];
}

export interface Comment {
  id: string;
  media_item_id: string;
  user_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  // These fields might come from joined queries
  user_name?: string;
  user_avatar?: string;
}

export interface Theme {
  id: string;
  name: string;
  class: string;
}

export interface ProjectTag {
  project_id: string;
  tag_id: string;
  created_at?: string;
}

// Update the utility function to handle both new and legacy name formats
export function getUserFullName(user: Pick<User, 'first_name' | 'last_name' | 'email' | 'name'>): string {
  // Check for first_name/last_name fields first
  if (user.first_name || user.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  }
  
  // Fall back to legacy name field if it exists
  if (user.name) {
    return user.name;
  }
  
  // Last resort: use email username
  return user.email?.split('@')[0] || 'User';
}
