import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddChapter } from '../hooks/useAddChapter';
import { useGetAllManga } from '../hooks/useGetAllManga';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export default function AddChapterForm() {
  const [selectedMangaId, setSelectedMangaId] = useState<string>('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  
  const { data: allManga, isLoading: mangaLoading } = useGetAllManga();
  const { mutate: addChapter, isPending } = useAddChapter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMangaId || !chapterTitle.trim() || !imageUrls.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const urls = imageUrls.split('\n').map(url => url.trim()).filter(url => url);
    
    if (urls.length === 0) {
      toast.error('Please provide at least one image URL');
      return;
    }

    const images = urls.map(url => ExternalBlob.fromURL(url));
    
    addChapter(
      { 
        mangaId: BigInt(selectedMangaId), 
        title: chapterTitle.trim(), 
        images 
      },
      {
        onSuccess: () => {
          toast.success('Chapter added successfully!');
          setChapterTitle('');
          setImageUrls('');
        },
        onError: (error) => {
          toast.error(`Failed to add chapter: ${error.message}`);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Chapter</CardTitle>
        <CardDescription>Add a chapter to an existing manga</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manga">Select Manga</Label>
            <Select value={selectedMangaId} onValueChange={setSelectedMangaId} disabled={isPending || mangaLoading}>
              <SelectTrigger id="manga">
                <SelectValue placeholder="Choose a manga" />
              </SelectTrigger>
              <SelectContent>
                {allManga?.map((manga) => (
                  <SelectItem key={Number(manga.id)} value={String(manga.id)}>
                    {manga.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chapterTitle">Chapter Title</Label>
            <Input
              id="chapterTitle"
              placeholder="Enter chapter title"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrls">Image URLs (one per line)</Label>
            <Textarea
              id="imageUrls"
              placeholder="https://example.com/page1.jpg&#10;https://example.com/page2.jpg&#10;https://example.com/page3.jpg"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              disabled={isPending}
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">Enter one image URL per line</p>
          </div>
          
          <Button type="submit" disabled={isPending || !selectedMangaId} className="w-full">
            {isPending ? 'Adding Chapter...' : 'Add Chapter'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
