
import { UserStatus } from '@/types';
import UserStatusBadge from './UserStatusBadge';

interface StatusDropdownProps {
  userId: string;
  currentStatus: UserStatus;
  updateUserStatus: (params: { userId: string; status: UserStatus }) => void;
}

export function StatusDropdown({ currentStatus }: StatusDropdownProps) {
  return <UserStatusBadge status={currentStatus} />;
}
