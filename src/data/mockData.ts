import { User, Project, MediaItem, Comment, Theme, Tag } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'Larissa Thompson',
    email: 'larissa@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    role: 'creator',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Maya Patel',
    email: 'maya@example.com',
    role: 'creator',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    role: 'creator',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

// Mock Tags
export const tags: Tag[] = [
  {
    id: 't1',
    name: 'UI/UX Design',
    description: 'User interface and experience design projects',
    createdBy: '1'
  },
  {
    id: 't2',
    name: 'Web Development',
    description: 'Web-based projects and applications',
    createdBy: '1'
  },
  {
    id: 't3',
    name: 'Mobile Apps',
    description: 'Mobile application design and development',
    createdBy: '1'
  },
  {
    id: 't4',
    name: 'Custom GPTs',
    description: 'Projects involving custom GPT models',
    createdBy: '1'
  },
  {
    id: 't5',
    name: 'Podcast',
    description: 'Podcast and audio content projects',
    createdBy: '1'
  },
  {
    id: 't6',
    name: 'Architecture',
    description: 'Architectural design projects',
    createdBy: '1'
  },
];

// Mock Media Items
const alexMediaItems: MediaItem[] = [
  {
    id: 'a1',
    title: 'Brand Identity Design',
    description: 'A brand design project for a tech startup focusing on minimalism and clarity.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400',
    dateCreated: '2023-10-15T10:30:00Z',
    creatorId: '2',
  },
  {
    id: 'a2',
    title: 'UX Research Findings',
    description: 'Key insights from our user research sessions for the mobile app project.',
    mediaType: 'document',
    mediaUrl: 'https://example.com/document',
    dateCreated: '2023-11-02T09:45:00Z',
    creatorId: '2',
  },
  {
    id: 'a3',
    title: 'Interaction Design Demo',
    description: 'A video showcasing the interaction design for our new product.',
    mediaType: 'video',
    mediaUrl: 'https://example.com/video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=400',
    dateCreated: '2023-11-10T14:20:00Z',
    creatorId: '2',
  },
];

const mayaMediaItems: MediaItem[] = [
  {
    id: 'm1',
    title: 'Mobile App Prototype',
    description: 'Interactive prototype for a fitness tracking application.',
    mediaType: 'link',
    mediaUrl: 'https://example.com/prototype',
    dateCreated: '2023-09-20T11:30:00Z',
    creatorId: '3',
  },
  {
    id: 'm2',
    title: 'Product Photography',
    description: 'High-quality product shots for marketing materials.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1554941829-202a0b2403b8?q=80&w=2000',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554941829-202a0b2403b8?q=80&w=400',
    dateCreated: '2023-10-05T13:15:00Z',
    creatorId: '3',
  },
];

const jordanMediaItems: MediaItem[] = [
  {
    id: 'j1',
    title: 'Architectural Visualization',
    description: '3D rendering of a modern residential building concept.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1545959549-3269d8a7e907?q=80&w=2000',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545959549-3269d8a7e907?q=80&w=400',
    dateCreated: '2023-08-12T08:20:00Z',
    creatorId: '4',
  },
  {
    id: 'j2',
    title: 'City Planning Proposal',
    description: 'Urban development concept for downtown revitalization.',
    mediaType: 'document',
    mediaUrl: 'https://example.com/document2',
    dateCreated: '2023-09-30T15:40:00Z',
    creatorId: '4',
  },
  {
    id: 'j3',
    title: 'Landscape Design Process',
    description: 'Walkthrough of our design process for a public park project.',
    mediaType: 'text',
    mediaUrl: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.',
    dateCreated: '2023-10-22T09:10:00Z',
    creatorId: '4',
  },
];

// Mock Projects
export const projects: Project[] = [
  {
    id: '1',
    title: 'Digital Design Portfolio',
    description: 'A collection of UI/UX design projects focused on creating intuitive user experiences.',
    creatorId: '2',
    creatorName: 'Alex Rodriguez',
    isPrivate: false,
    coverImage: 'https://images.unsplash.com/photo-1534670007418-bc197b9908cf?q=80&w=1000',
    mediaItems: alexMediaItems,
    dateCreated: '2023-08-01T00:00:00Z',
    dateUpdated: '2023-11-15T00:00:00Z',
    tags: ['t1', 't2'],
  },
  {
    id: '2',
    title: 'Product Design Showcase',
    description: 'Featuring my work on digital product design, from concept to implementation.',
    creatorId: '3',
    creatorName: 'Maya Patel',
    isPrivate: true,
    coverImage: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=1000',
    mediaItems: mayaMediaItems,
    dateCreated: '2023-07-15T00:00:00Z',
    dateUpdated: '2023-10-10T00:00:00Z',
    tags: ['t1', 't3'],
  },
  {
    id: '3',
    title: 'Architectural Design',
    description: 'Showcasing my architectural projects and design methodology.',
    creatorId: '4',
    creatorName: 'Jordan Lee',
    isPrivate: false,
    coverImage: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1000',
    mediaItems: jordanMediaItems,
    dateCreated: '2023-06-20T00:00:00Z',
    dateUpdated: '2023-10-25T00:00:00Z',
    tags: ['t6'],
  },
];

// Mock Comments
export const comments: Comment[] = [
  {
    id: 'c1',
    mediaItemId: 'a1',
    userId: '1',
    userName: 'Larissa Thompson',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    content: 'The minimalist approach really works well with the brand identity. Great job on the color palette!',
    dateCreated: '2023-10-16T08:45:00Z',
  },
  {
    id: 'c2',
    mediaItemId: 'a1',
    userId: '3',
    userName: 'Maya Patel',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    content: 'I love how you balanced simplicity with distinctive elements. Would you mind sharing your process?',
    dateCreated: '2023-10-16T10:30:00Z',
  },
  {
    id: 'c3',
    mediaItemId: 'm2',
    userId: '2',
    userName: 'Alex Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    content: 'The lighting in these shots is perfect. What setup did you use?',
    dateCreated: '2023-10-06T09:15:00Z',
  },
  {
    id: 'c4',
    mediaItemId: 'j1',
    userId: '1',
    userName: 'Larissa Thompson',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    content: 'The modern aesthetic is compelling. I particularly like the integration with the surrounding landscape.',
    dateCreated: '2023-08-14T11:20:00Z',
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
  return comments.filter(comment => comment.mediaItemId === mediaItemId);
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
  return project.tags.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean) as Tag[];
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
  return user.role === 'admin' || user.id === project.creatorId;
};

// Check if user can create tags (only admins)
export const canCreateTags = (user: User | null): boolean => {
  return user?.role === 'admin';
};
