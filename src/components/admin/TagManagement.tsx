import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash, Plus, Save, X, Tag as TagIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export function TagManagement() {
  const { user, isAdmin } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [projectsUsingTag, setProjectsUsingTag] = useState<number>(0);

  // Fetch all tags
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('tags')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        setTags(data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
        toast.error('Failed to load tags');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, [isAdmin]);

  // Handle tag editing
  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagDescription(tag.description || '');
  };

  // Handle save edited tag
  const handleSaveTag = async () => {
    if (!editingTag) return;
    if (!newTagName.trim()) {
      toast.error('Tag name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Check if name already exists (excluding the current tag being edited)
      const { data: existingTag, error: checkError } = await supabase
        .from('tags')
        .select('id')
        .eq('name', newTagName)
        .neq('id', editingTag.id)
        .maybeSingle();
        
      if (existingTag) {
        toast.error(`A tag with the name "${newTagName}" already exists`);
        setIsSubmitting(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('tags')
        .update({ 
          name: newTagName.trim(),
          description: newTagDescription.trim() || null
        })
        .eq('id', editingTag.id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setTags(prevTags => 
        prevTags.map(tag => 
          tag.id === editingTag.id ? data : tag
        )
      );
      
      setEditingTag(null);
      toast.success('Tag updated successfully');
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error('Failed to update tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add new tag
  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Check if name already exists
      const { data: existingTag, error: checkError } = await supabase
        .from('tags')
        .select('id')
        .eq('name', newTagName)
        .maybeSingle();
        
      if (existingTag) {
        toast.error(`A tag with the name "${newTagName}" already exists`);
        setIsSubmitting(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: newTagName.trim(),
          created_by: user?.id || '',
          description: 'Admin created tag'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setTags(prevTags => [...prevTags, data]);
      
      // Reset form
      setNewTagName('');
      setNewTagDescription('');
      toast.success('Tag added successfully');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete tag confirmation
  const handleConfirmDelete = async (tag: Tag) => {
    // First check if the tag is used by any projects
    try {
      const { count, error } = await supabase
        .from('project_tags')
        .select('*', { count: 'exact', head: true })
        .eq('tag_id', tag.id);
        
      if (error) throw error;
      
      setProjectsUsingTag(count || 0);
      setTagToDelete(tag);
      setIsDeleteDialogOpen(true);
    } catch (error) {
      console.error('Error checking tag usage:', error);
      toast.error('Failed to check tag usage');
    }
  };

  // Handle delete tag
  const handleDeleteTag = async () => {
    if (!tagToDelete) return;
    
    try {
      setIsSubmitting(true);
      
      // First delete tag references from projects
      if (projectsUsingTag > 0) {
        const { error: refError } = await supabase
          .from('project_tags')
          .delete()
          .eq('tag_id', tagToDelete.id);
          
        if (refError) throw refError;
      }
      
      // Then delete the tag
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagToDelete.id);
        
      if (error) throw error;
      
      // Update local state
      setTags(prevTags => prevTags.filter(tag => tag.id !== tagToDelete.id));
      
      setIsDeleteDialogOpen(false);
      setTagToDelete(null);
      toast.success('Tag deleted successfully');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            Only administrators can manage tags.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tag Management</h2>
      </div>

      {/* Add New Tag Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Tag
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newTagName">Tag Name</Label>
              <Input
                id="newTagName"
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newTagDescription">Description (optional)</Label>
              <Textarea
                id="newTagDescription"
                placeholder="Enter tag description"
                value={newTagDescription}
                onChange={(e) => setNewTagDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button 
              onClick={handleAddTag} 
              disabled={isSubmitting || !newTagName.trim()}
            >
              {isSubmitting ? (
                <div className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Tag
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            Existing Tags
          </CardTitle>
          <CardDescription>
            Manage existing tags. Deleting a tag will remove it from all projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              ))}
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No tags found. Create your first tag above.
            </div>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <div 
                  key={tag.id} 
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  {editingTag?.id === tag.id ? (
                    <div className="flex-1 mr-4 space-y-2">
                      <Input
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Tag name"
                        disabled={isSubmitting}
                      />
                      <Textarea
                        value={newTagDescription}
                        onChange={(e) => setNewTagDescription(e.target.value)}
                        placeholder="Description (optional)"
                        rows={2}
                        disabled={isSubmitting}
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={handleSaveTag}
                          disabled={isSubmitting || !newTagName.trim()}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditingTag(null)}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {tag.name}
                        </Badge>
                        {tag.description === 'Admin created tag' && (
                          <Badge variant="outline" className="text-xs">Admin</Badge>
                        )}
                      </div>
                      {tag.description && tag.description !== 'Admin created tag' && tag.description !== 'User created tag' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {tag.description}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {editingTag?.id !== tag.id && (
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleEditTag(tag)}
                        disabled={isSubmitting}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => handleConfirmDelete(tag)}
                        disabled={isSubmitting}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the tag "{tagToDelete?.name}"?
            </DialogDescription>
          </DialogHeader>
          
          {projectsUsingTag > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This tag is used by {projectsUsingTag} project{projectsUsingTag === 1 ? '' : 's'}.
                Deleting it will remove this tag from all projects.
              </AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setTagToDelete(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTag}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin mr-2" />
              ) : (
                <Trash className="h-4 w-4 mr-2" />
              )}
              Delete Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
