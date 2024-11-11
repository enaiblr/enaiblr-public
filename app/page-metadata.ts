import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const query = searchParams?.q;
  
  return {
    title: query ? `Search: ${query}` : null,
  };
}