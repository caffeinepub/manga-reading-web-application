import { useState, useCallback } from 'react';
import { useGetMangaList } from '../hooks/useGetMangaList';
import { useSearchManga } from '../hooks/useSearchManga';
import MangaCard from '../components/MangaCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { Loader2 } from 'lucide-react';

const PAGE_SIZE = 12;

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: mangaList, isLoading: listLoading } = useGetMangaList(currentPage);
  const { data: searchResults, isLoading: searchLoading } = useSearchManga(searchTerm);

  const isSearching = searchTerm.trim().length > 0;
  const displayManga = isSearching ? searchResults : mangaList;
  const isLoading = isSearching ? searchLoading : listLoading;

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
  }, []);

  const totalPages = isSearching ? 1 : Math.ceil((displayManga?.length || 0) / PAGE_SIZE);

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-4 bg-clip-text text-transparent">
            Discover Amazing Manga
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore thousands of manga titles and start your reading journey
          </p>
        </div>
        
        <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : displayManga && displayManga.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {displayManga.map((manga) => (
              <MangaCard key={Number(manga.id)} manga={manga} />
            ))}
          </div>
          
          {!isSearching && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {isSearching ? 'No manga found matching your search.' : 'No manga available yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
