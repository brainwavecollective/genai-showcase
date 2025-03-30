
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
}

export interface MediaItem {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  media_type: 'image' | 'video' | 'link' | 'document' | 'text';
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
