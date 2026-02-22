import { Link } from '@tanstack/react-router';
import { BookMarked, History, Home, Shield } from 'lucide-react';
import LoginButton from './LoginButton';
import ThemeToggle from './ThemeToggle';
import UserProfileSetup from './UserProfileSetup';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <UserProfileSetup />
      
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-4 bg-clip-text text-transparent transition-all group-hover:scale-105">
                MangaVerse
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              >
                <Home className="inline-block w-4 h-4 mr-2" />
                Home
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/bookmarks"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                  >
                    <BookMarked className="inline-block w-4 h-4 mr-2" />
                    Bookmarks
                  </Link>
                  
                  <Link
                    to="/history"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                  >
                    <History className="inline-block w-4 h-4 mr-2" />
                    History
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                    >
                      <Shield className="inline-block w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} MangaVerse. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              Built with <span className="text-destructive">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
