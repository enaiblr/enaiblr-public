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

export default async function Page({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  return (
    <>
      <Sidebar />
      <SearchPage initialQuery={searchParams.q || ""} />
    </>
  )}