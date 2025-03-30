
import { User, MediaItem, Project } from '@/types';

/**
 * Filters out content created by denied users
 * @param content An array of content items with a creator_id property
 * @param isUserDenied Function that checks if a user is denied
 * @returns Filtered content excluding items from denied users
 */
export function filterContentByUserStatus<T extends { creator_id: string }>(
  content: T[],
  isUserDenied: (userId: string) => boolean
): T[] {
  return content.filter(item => !isUserDenied(item.creator_id));
}

/**
 * Creates a higher-order function to check if a user is denied based on a list of users
 * For use when the useUsers hook is not available
 */
export function createUserStatusChecker(users: User[]): (userId: string) => boolean {
  return (userId: string): boolean => {
    const user = users.find(u => u.id === userId);
    return user?.status === 'denied';
  };
}
