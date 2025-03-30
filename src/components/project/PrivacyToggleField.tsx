
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';

interface PrivacyToggleFieldProps {
  label: string;
  description?: string;
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
  disabled?: boolean;
}

export function PrivacyToggleField({ 
  label, 
  description, 
  isPublic, 
  onChange, 
  disabled = false 
}: PrivacyToggleFieldProps) {
  return (
    <div className="flex items-center justify-between py-2 space-x-2">
      <div className="space-y-0.5">
        <Label className="text-base">{label}</Label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center">
        <Switch
          checked={isPublic}
          onCheckedChange={onChange}
          disabled={disabled}
          className="mr-2 data-[state=checked]:bg-green-500"
        />
        <span className="flex items-center text-sm">
          {isPublic ? (
            <>
              <Eye className="h-3.5 w-3.5 mr-1" />
              Public
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5 mr-1" />
              Private
            </>
          )}
        </span>
      </div>
    </div>
  );
}
