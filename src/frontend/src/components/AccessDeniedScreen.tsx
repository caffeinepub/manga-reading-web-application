import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function AccessDeniedScreen() {
  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <Alert className="max-w-md border-destructive">
        <ShieldX className="h-4 w-4 text-destructive" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p>You don't have permission to access this page. Admin privileges are required.</p>
          <Link to="/">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    </div>
  );
}
