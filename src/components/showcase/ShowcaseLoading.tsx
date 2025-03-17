
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function ShowcaseLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 container max-w-7xl mx-auto px-4 md:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/4 bg-muted/70 rounded" />
          <div className="h-12 w-3/4 bg-muted/70 rounded" />
          <div className="h-6 w-1/2 bg-muted/70 rounded" />
          <div className="h-[400px] bg-muted/70 rounded-lg" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
