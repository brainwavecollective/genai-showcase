
export type UserRole = 'admin' | 'creator' | 'visitor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  mediaType: 'image' | 'video' | 'link' | 'document' | 'text';
  mediaUrl: string;
  thumbnailUrl?: string;
  dateCreated: string;
  creatorId: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  creatorName: string;
  isPrivate: boolean;
  coverImage?: string;
  mediaItems: MediaItem[];
  dateCreated: string;
  dateUpdated: string;
}

export interface Comment {
  id: string;
  mediaItemId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  dateCreated: string;
}

export interface Theme {
  id: string;
  name: string;
  class: string;
}
