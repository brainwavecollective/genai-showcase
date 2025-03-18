
import { User, Project, MediaItem, Comment, Theme, Tag } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'Larissa Thompson',
    email: 'larissa@example.com',
    role: 'admin',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    role: 'creator',
    avatar_url: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Maya Patel',
    email: 'maya@example.com',
    role: 'creator',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    role: 'creator',
    avatar_url: 'https://i.pravatar.cc/150?img=4',
  },
];

// Mock Tags
export const tags: Tag[] = [
  {
    id: 't1',
    name: 'UI/UX Design',
    description: 'User interface and experience design projects',
    created_by: '1'
  },
  {
    id: 't2',
    name: 'Web Development',
    description: 'Web-based projects and applications',
    created_by: '1'
  },
  {
    id: 't3',
    name: 'Mobile Apps',
    description: 'Mobile application design and development',
    created_by: '1'
  },
  {
    id: 't4',
    name: 'Custom GPTs',
    description: 'Projects involving custom GPT models',
    created_by: '1'
  },
  {
    id: 't5',
    name: 'Podcast',
    description: 'Podcast and audio content projects',
    created_by: '1'
  },
  {
    id: 't6',
    name: 'Architecture',
    description: 'Architectural design projects',
    created_by: '1'
  },
];

// Mock Media Items
const alexMediaItems: MediaItem[] = [
  {
    id: 'a1',
    title: 'Brand Identity Design',
    description: 'A brand design project for a tech startup focusing on minimalism and clarity.',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000',
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400',
    creator_id: '2',
    project_id: '1',
    created_at: '2023-10-15T10:30:00Z',
  },
  {
    id: 'a2',
    title: 'UX Research Findings',
    description: 'Key insights from our user research sessions for the mobile app project.',
    media_type: 'document',
    media_url: 'https://example.com/document',
    creator_id: '2',
    project_id: '1',
    created_at: '2023-11-02T09:45:00Z',
  },
  {
    id: 'a3',
    title: 'Interaction Design Demo',
    description: 'A video showcasing the interaction design for our new product.',
    media_type: 'video',
    media_url: 'https://example.com/video',
    thumbnail_url: 'https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=400',
    creator_id: '2',
    project_id: '1',
    created_at: '2023-11-10T14:20:00Z',
  },
];

const mayaMediaItems: MediaItem[] = [
  {
    id: 'm1',
    title: 'Mobile App Prototype',
    description: 'Interactive prototype for a fitness tracking application.',
    media_type: 'link',
    media_url: 'https://example.com/prototype',
    creator_id: '3',
    project_id: '2',
    created_at: '2023-09-20T11:30:00Z',
  },
  {
    id: 'm2',
    title: 'Product Photography',
    description: 'High-quality product shots for marketing materials.',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1554941829-202a0b2403b8?q=80&w=2000',
    thumbnail_url: 'https://images.unsplash.com/photo-1554941829-202a0b2403b8?q=80&w=400',
    creator_id: '3',
    project_id: '2',
    created_at: '2023-10-05T13:15:00Z',
  },
];

const jordanMediaItems: MediaItem[] = [
  {
    id: 'j1',
    title: 'Architectural Visualization',
    description: '3D rendering of a modern residential building concept.',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1545959549-3269d8a7e907?q=80&w=2000',
    thumbnail_url: 'https://images.unsplash.com/photo-1545959549-3269d8a7e907?q=80&w=400',
    creator_id: '4',
    project_id: '3',
    created_at: '2023-08-12T08:20:00Z',
  },
  {
    id: 'j2',
    title: 'City Planning Proposal',
    description: 'Urban development concept for downtown revitalization.',
    media_type: 'document',
    media_url: 'https://example.com/document2',
    creator_id: '4',
    project_id: '3',
    created_at: '2023-09-30T15:40:00Z',
  },
  {
    id: 'j3',
    title: 'Landscape Design Process',
    description: 'Walkthrough of our design process for a public park project.',
    media_type: 'text',
    media_url: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.',
    creator_id: '4',
    project_id: '3',
    created_at: '2023-10-22T09:10:00Z',
  },
];

// Mock Projects
export const projects: Project[] = [
  {
    id: '1',
    title: 'Digital Design Portfolio',
    description: 'A collection of UI/UX design projects focused on creating intuitive user experiences.',
    creator_id: '2',
    creator_name: 'Alex Rodriguez',
    is_private: false,
    cover_image_url: 'https://images.unsplash.com/photo-1534670007418-bc197b9908cf?q=80&w=1000',
    created_at: '2023-08-01T00:00:00Z',
    updated_at: '2023-11-15T00:00:00Z',
    tag_ids: ['t1', 't2'],
    tag_names: ['UI/UX Design', 'Web Development'],
    mediaItems: alexMediaItems,
  },
  {
    id: '2',
    title: 'Product Design Showcase',
    description: 'Featuring my work on digital product design, from concept to implementation.',
    creator_id: '3',
    creator_name: 'Maya Patel',
    is_private: true,
    cover_image_url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=1000',
    created_at: '2023-07-15T00:00:00Z',
    updated_at: '2023-10-10T00:00:00Z',
    tag_ids: ['t1', 't3'],
    tag_names: ['UI/UX Design', 'Mobile Apps'],
    mediaItems: mayaMediaItems,
  },
  {
    id: '3',
    title: 'Architectural Design',
    description: 'Showcasing my architectural projects and design methodology.',
    creator_id: '4',
    creator_name: 'Jordan Lee',
    is_private: false,
    cover_image_url: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1000',
    created_at: '2023-06-20T00:00:00Z',
    updated_at: '2023-10-25T00:00:00Z',
    tag_ids: ['t6'],
    tag_names: ['Architecture'],
    mediaItems: jordanMediaItems,
  },
];

// Mock Comments
export const comments: Comment[] = [
  {
    id: 'c1',
    media_item_id: 'a1',
    user_id: '1',
    content: 'The minimalist approach really works well with the brand identity. Great job on the color palette!',
    created_at: '2023-10-16T08:45:00Z',
    user_name: 'Larissa Thompson',
    user_avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'c2',
    media_item_id: 'a1',
    user_id: '3',
    content: 'I love how you balanced simplicity with distinctive elements. Would you mind sharing your process?',
    created_at: '2023-10-16T10:30:00Z',
    user_name: 'Maya Patel',
    user_avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 'c3',
    media_item_id: 'm2',
    user_id: '2',
    content: 'The lighting in these shots is perfect. What setup did you use?',
    created_at: '2023-10-06T09:15:00Z',
    user_name: 'Alex Rodriguez',
    user_avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 'c4',
    media_item_id: 'j1',
    user_id: '1',
    content: 'The modern aesthetic is compelling. I particularly like the integration with the surrounding landscape.',
    created_at: '2023-08-14T11:20:00Z',
    user_name: 'Larissa Thompson',
    user_avatar: 'https://i.pravatar.cc/150?img=1',
  },
];

// Available themes
export const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    class: 'light',
  },
  {
    id: 'dark',
    name: 'Dark',
    class: 'dark',
  },
  {
    id: 'system',
    name: 'System',
    class: '',
  },
];

// Function to find project by ID
export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

// Function to get media item by ID
export const getMediaItemById = (id: string): MediaItem | undefined => {
  return projects.flatMap(p => p.mediaItems).find(item => item.id === id);
};

// Function to get comments for a media item
export const getCommentsForMediaItem = (mediaItemId: string): Comment[] => {
  return comments.filter(comment => comment.media_item_id === mediaItemId);
};

// Function to get a user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Function to get tag by ID
export const getTagById = (id: string): Tag | undefined => {
  return tags.find(tag => tag.id === id);
};

// Function to get all tags for a project
export const getProjectTags = (project: Project): Tag[] => {
  return (project.tag_ids || []).map(tagId => tags.find(t => t.id === tagId)).filter(Boolean) as Tag[];
};

// Current logged in user (for mock purposes)
export const currentUser: User | null = null;

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

// Check if user can edit project
export const canEditProject = (user: User | null, project: Project): boolean => {
  if (!user) return false;
  return user.role === 'admin' || user.id === project.creator_id;
};

// Check if user can create tags (only admins)
export const canCreateTags = (user: User | null): boolean => {
  return user?.role === 'admin';
};
