import SearchPage from '@/components/search/SearchPage'
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

export default function Page({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  return <SearchPage initialQuery={searchParams.q || ""} />
}