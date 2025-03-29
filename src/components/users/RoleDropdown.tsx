
import { UserRole } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoleDropdownProps {
  userId: string;
  currentRole: UserRole;
  updateUserRole: (params: { userId: string; role: UserRole }) => void;
}

const roleOptions = [
  { value: 'visitor', label: 'Visitor' },
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
];

export function RoleDropdown({ userId, currentRole, updateUserRole }: RoleDropdownProps) {
  const handleRoleChange = (value: UserRole) => {
    updateUserRole({ userId, role: value });
  };

  return (
    <Select value={currentRole} onValueChange={handleRoleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        {roleOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
