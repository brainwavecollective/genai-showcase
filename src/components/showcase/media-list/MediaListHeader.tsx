
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface MediaListHeaderProps {
  canEdit: boolean;
  showUpload: boolean;
  onToggleUpload: () => void;
}

export function MediaListHeader({ 
  canEdit, 
  showUpload, 
  onToggleUpload 
}: MediaListHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl">Media</CardTitle>
        {canEdit && (
          <Button
            onClick={onToggleUpload}
            size="sm"
            variant={showUpload ? "secondary" : "default"}
          >
            {showUpload ? "Cancel" : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add Media
              </>
            )}
          </Button>
        )}
      </div>
    </CardHeader>
  );
}
