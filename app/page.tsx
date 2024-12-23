'use client'

import SearchPage from '@/components/search/SearchPage'
import { Sidebar } from '@/components/Sidebar'
import { useEffect, useState } from 'react'
import { AnimatedBackground } from '@/components/animated-background'

// Create a module-level variable to persist across route changes
let hasShownSidebarInSession = false;

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
      <Sidebar hasShownSidebarInSession={hasShownSidebarInSession} onSidebarShown={() => { hasShownSidebarInSession = true }} />
      <AnimatedBackground />
      <SearchPage initialQuery={params.q || ""} />
    </>
  )
}