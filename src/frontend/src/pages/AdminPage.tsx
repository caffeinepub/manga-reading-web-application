import { Shield } from 'lucide-react';
import AddMangaForm from '../components/AddMangaForm';
import AddChapterForm from '../components/AddChapterForm';

export default function AdminPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Manage manga and chapters
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <AddMangaForm />
        <AddChapterForm />
      </div>
    </div>
  );
}
