'use client'

import { useState } from 'react'
import { Menu, X, Search, BookOpen, Wallet, FlaskConical } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SidebarProps {
  apps: {
    name: string
    icon: string
    slug: string
  }[]
}

const apps = [
    { name: 'AI Tools Search', icon: Search, slug: '' },  
    { name: 'Japanese Flashcard', icon: BookOpen, slug: 'japanese-flashcard' }, 
    { name: 'Expense Tracker', icon: Wallet, slug: 'expense-tracker' }, 
    { name: 'Science Creator', icon: FlaskConical, slug: 'science-creator' }, 
  ]
  

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 hover:bg-gray-100 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="pt-16 px-4">
          {/* <h2 className="text-xl font-bold mb-4">Applications</h2> */}
          <ul className="space-y-2">
            {apps.map((app) => {
              const href = `/${app.slug}`
              const isActive = pathname === href
              return (
                <li key={app.slug}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg",
                      isActive && "font-medium outline outline-2 outline-blue-600"
                    )}
                  >
                    <app.icon size={20} className="text-xl" />
                    <span>{app.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}