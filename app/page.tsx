'use client'

import Link from 'next/link'
import { AnimatedBackground } from '@/components/animated-background'
import { apps } from '@/config/apps'
import RenderFooter from '@/components/RenderFooter'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <main className="flex-1 container mx-auto px-4 pt-16 pb-8 flex items-center justify-center">
        <div className="w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold tracking-tighter mb-4">
              en<span className="text-blue-600">ai</span>blr
            </h1>
            <p className="text-muted-foreground">Unlimited AI Platform</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
            {apps.map((app) => {
              const Icon = app.icon
              return (
                <Link
                  key={app.slug}
                  href={`/${app.slug}`}
                  className="group relative flex flex-col items-center p-4 md:p-6 bg-card hover:bg-blue-50 rounded-xl border transition-colors hover:outline-2 hover:outline-blue-600"
                >
                  <div className="mb-3 md:mb-4 p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <h2 className="text-sm md:text-lg font-semibold text-center">{app.name}</h2>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <RenderFooter />
    </div>
  )
}
