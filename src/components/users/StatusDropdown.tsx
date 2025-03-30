
import { UserStatus } from '@/types';
import UserStatusBadge from './UserStatusBadge';

interface StatusDropdownProps {
  currentStatus: UserStatus;
}

export function StatusDropdown({ currentStatus }: StatusDropdownProps) {
  return <UserStatusBadge status={currentStatus} />;
}
