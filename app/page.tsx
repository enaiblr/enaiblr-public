'use client'

import SearchPage from '@/components/search/SearchPage'
import { Sidebar } from '@/components/Sidebar'
import { Metadata } from 'next'
import { useEffect, useState } from 'react'

export default function Page({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const [params, setParams] = useState<{ q?: string }>({});

  useEffect(() => {
    searchParams.then(setParams);
  }, [searchParams]);

  return (
    <>
      <Sidebar />
      <SearchPage initialQuery={params.q || ""} />
    </>
  )}