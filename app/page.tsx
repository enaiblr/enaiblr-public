import SearchPage from '@/components/search/SearchPage'
import { Sidebar } from '@/components/Sidebar'
import { Metadata } from 'next'


export default function Page({
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