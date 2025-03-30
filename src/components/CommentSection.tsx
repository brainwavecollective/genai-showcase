import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare } from 'lucide-react';
import { Comment } from '@/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentSectionProps {
  comments: Comment[];
  mediaItemId: string;
  onAddComment: (content: string) => void;
  isLoading?: boolean;
}

export function CommentSection({ comments, mediaItemId, onAddComment, isLoading = false }: CommentSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Pass the content string to the parent component
      await onAddComment(newComment);
      
      // Only clear input if submission was successful
      setNewComment('');
    } catch (error) {
      console.error('Error in comment submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle Enter key to submit comment, Shift+Enter for line break
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newComment.trim() && !isSubmitting && !isLoading) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-medium">Comments</h3>
        <span className="text-muted-foreground text-sm">({isLoading ? '...' : comments.length})</span>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            className="min-h-[100px]"
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!newComment.trim() || isSubmitting || isLoading}
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

      {isLoading ? (
        <div className="space-y-4">
          <Separator />
          <LoadingCommentSkeleton />
          <Separator />
          <LoadingCommentSkeleton />
        </div>
      ) : comments.length > 0 ? (
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
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}

// Loading skeleton for comments
function LoadingCommentSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
