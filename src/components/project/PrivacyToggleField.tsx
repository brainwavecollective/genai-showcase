
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
    <div className={`flex items-center justify-end ${className}`}>
      <div className="flex items-center">
        <Switch
          checked={isPublic}
          onCheckedChange={onChange}
          disabled={disabled}
          className="mr-2 data-[state=checked]:bg-green-500"
        />
        <span className="flex items-center text-xs text-muted-foreground">
          {isPublic ? (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Public
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Private
            </>
          )}
        </span>
      </div>
    </div>
  );
}

// Export an alias for backwards compatibility with existing code
export const PrivacyToggle = PrivacyToggleField;
