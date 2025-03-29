
import { UserStatus } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StatusDropdownProps {
  userId: string;
  currentStatus: UserStatus;
  updateUserStatus: (params: { userId: string; status: UserStatus }) => void;
}

const statusOptions = [
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
];

export function StatusDropdown({ userId, currentStatus, updateUserStatus }: StatusDropdownProps) {
  const handleStatusChange = (value: UserStatus) => {
    updateUserStatus({ userId, status: value });
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
