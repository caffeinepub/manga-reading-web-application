import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAddManga } from '../hooks/useAddManga';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export default function AddMangaForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  
  const { mutate: addManga, isPending } = useAddManga();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !coverImageUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const coverImage = ExternalBlob.fromURL(coverImageUrl.trim());
    
    addManga(
      { title: title.trim(), description: description.trim(), coverImage },
      {
        onSuccess: () => {
          toast.success('Manga added successfully!');
          setTitle('');
          setDescription('');
          setCoverImageUrl('');
        },
        onError: (error) => {
          toast.error(`Failed to add manga: ${error.message}`);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Manga</CardTitle>
        <CardDescription>Create a new manga entry in the library</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter manga title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter manga description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Adding Manga...' : 'Add Manga'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
