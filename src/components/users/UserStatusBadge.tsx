
import { UserStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface UserStatusBadgeProps {
  status: UserStatus;
}

const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  // Define badge properties based on status
  const statusConfig = {
    pending_review: {
      label: 'Pending Review',
      variant: 'outline' as const,
      className: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
      icon: AlertCircle
    },
    approved: {
      label: 'Approved',
      variant: 'outline' as const,
      className: 'bg-green-100 text-green-800 hover:bg-green-200',
      icon: CheckCircle
    },
    denied: {
      label: 'Denied',
      variant: 'outline' as const,
      className: 'bg-red-100 text-red-800 hover:bg-red-200',
      icon: XCircle
    }
  };

  const config = statusConfig[status] || {
    label: 'Unknown',
    variant: 'outline' as const,
    className: '',
    icon: HelpCircle
  };

  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export default UserStatusBadge;
