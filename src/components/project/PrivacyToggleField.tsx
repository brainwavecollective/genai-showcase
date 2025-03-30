
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';

interface PrivacyToggleFieldProps {
  label?: string;
  description?: string;
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function PrivacyToggleField({ 
  label, 
  description, 
  isPublic, 
  onChange, 
  disabled = false,
  className = ''
}: PrivacyToggleFieldProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Switch
        checked={isPublic}
        onCheckedChange={onChange}
        disabled={disabled}
        className="mr-2 data-[state=checked]:bg-green-500"
      />
    </div>
  );
}

// Export an alias for backwards compatibility with existing code
export const PrivacyToggle = PrivacyToggleField;
