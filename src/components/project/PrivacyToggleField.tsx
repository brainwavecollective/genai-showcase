
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';

interface PrivacyToggleProps {
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
}

export function PrivacyToggle({ isPrivate, setIsPrivate }: PrivacyToggleProps) {
  return (
    <div className="flex items-center space-x-3">
      <Switch
        id="private"
        checked={isPrivate}
        onCheckedChange={setIsPrivate}
        className="data-[state=unchecked]:bg-background"
      />
      <Label htmlFor="private" className="flex items-center text-base cursor-pointer">
        {isPrivate ? (
          <>
            <EyeOff className="h-5 w-5 mr-2" />
            Private Project
          </>
        ) : (
          <>
            <Eye className="h-5 w-5 mr-2" />
            Public Project
          </>
        )}
      </Label>
    </div>
  );
}
