import SearchPage from '@/components/search/SearchPage'
import { Sidebar } from '@/components/Sidebar'
import { Metadata } from 'next'

export async function generateMetadata({
  searchParams
}: {
  searchParams: { q?: string }
}): Promise<Metadata> {
  const query = searchParams?.q
  return {
    title: query ? `Search: ${query} | enaiblr` : 'enaiblr - AI Tools Search Engine',
  }
}

interface SearchPageParams {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function Page({ searchParams }: SearchPageParams) {
  return (
    <>
      <Sidebar />
      <SearchPage initialQuery={searchParams.q?.toString() || ""} />
    </>
  )
}