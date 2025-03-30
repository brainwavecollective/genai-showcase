
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare } from 'lucide-react';
import { Comment, getUserFullName } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  comments: Comment[];
  mediaItemId: string;
  onAddComment: (content: string) => void;
}

export function CommentSection({ comments, mediaItemId, onAddComment }: CommentSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Pass the content string to the parent component
    onAddComment(newComment);
    setNewComment('');
    setIsSubmitting(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-medium">Comments</h3>
        <span className="text-muted-foreground text-sm">({comments.length})</span>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Sign in to leave a comment.
            </p>
          </CardContent>
        </Card>
      )}

      {comments.length > 0 && (
        <div className="space-y-4">
          <Separator />
          
          {comments.map((comment) => (
            <div key={comment.id} className="animate-fade-in">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  {comment.user_avatar && (
                    <AvatarImage src={comment.user_avatar} alt={comment.user_name || ''} />
                  )}
                  <AvatarFallback>{comment.user_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    {comment.user_id ? (
                      <Link 
                        to={`/user/${comment.user_id}`} 
                        className="text-sm font-medium hover:underline"
                      >
                        {comment.user_name || 'Unknown User'}
                      </Link>
                    ) : (
                      <h4 className="text-sm font-medium">{comment.user_name || 'Unknown User'}</h4>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at || '')}
                    </span>
                  </div>
                  
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
              
              {comments.indexOf(comment) < comments.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
