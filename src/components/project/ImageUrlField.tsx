
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Image } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUrlFieldProps {
  coverImageUrl: string;
  setCoverImageUrl: (url: string) => void;
}

export function ImageUrlField({ coverImageUrl, setCoverImageUrl }: ImageUrlFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="coverImage" className="text-xl font-semibold">Cover Image URL</Label>
      <div className="flex gap-2">
        <Input
          id="coverImage"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="bg-background border-input"
        />
        <Button 
          type="button" 
          variant="outline"
          className="bg-muted border-muted-foreground rounded-xl px-4 aspect-square flex items-center justify-center"
          onClick={() => {
            // In a real app, this would open an image upload dialog
            toast.info('Image upload functionality would open here');
          }}
        >
          <Image className="h-6 w-6" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        For demo purposes, you can enter any valid image URL
      </p>
    </div>
  );
}
