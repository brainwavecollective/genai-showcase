
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Image, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUrlFieldProps {
  coverImageUrl: string;
  setCoverImageUrl: (url: string) => void;
}

export function ImageUrlField({ coverImageUrl, setCoverImageUrl }: ImageUrlFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  // Create a hidden file input that we'll trigger programmatically
  const fileInputRef = useState<HTMLInputElement | null>(null);
  
  const handleUploadClick = () => {
    // Trigger the hidden file input
    if (fileInputRef[0]) {
      fileInputRef[0].click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image is too large. Maximum size is 5MB');
      return;
    }
    
    setIsUploading(true);
    
    // Create a URL for the file
    const imageUrl = URL.createObjectURL(file);
    
    // Simulate upload delay for better UX (would be a real upload in production)
    setTimeout(() => {
      setCoverImageUrl(imageUrl);
      setIsUploading(false);
      toast.success('Image uploaded successfully');
      
      // Clear the file input value so the same file can be selected again if needed
      if (fileInputRef[0]) {
        fileInputRef[0].value = '';
      }
    }, 1000);
  };

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
        <input 
          type="file"
          accept="image/*"
          className="hidden"
          ref={(el) => fileInputRef[0] = el}
          onChange={handleFileChange}
        />
        <Button 
          type="button" 
          variant="outline"
          className="bg-muted border-muted-foreground rounded-xl px-4 aspect-square flex items-center justify-center"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {coverImageUrl && (
        <div className="mt-4 relative">
          <img 
            src={coverImageUrl} 
            alt="Cover preview" 
            className="w-full h-40 object-cover rounded-lg border border-input"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
            onClick={() => setCoverImageUrl('')}
          >
            Remove
          </Button>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mt-1">
        Upload an image or enter a URL. Recommended size: 1200 x 630px.
      </p>
    </div>
  );
}
