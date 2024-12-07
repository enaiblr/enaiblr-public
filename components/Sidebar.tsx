'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, Search, MessageSquare, BookOpen, Wallet, FlaskConical, WandSparkles } from 'lucide-react'
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
  { name: 'Disposable AI Chat', icon: MessageSquare, slug: 'chat' },
  { name: 'AI Image Creator', icon: WandSparkles, slug: 'imagen' },
  // { name: 'Japanese Flashcard', icon: BookOpen, slug: 'japanese-flashcard' },
  // { name: 'Expense Tracker', icon: Wallet, slug: 'expense-tracker' },
  // { name: 'Science Creator', icon: FlaskConical, slug: 'science-creator' },
]


export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  const toggleSidebar = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 hover:bg-gray-100 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        ref={sidebarRef}
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-opacity-70 bg-white/60 backdrop-blur-md shadow-lg transform transition-transform duration-300 ease-in-out z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="pt-16 px-4">
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
          <div className="absolute bottom-4 left-4 text-sm text-gray-600">
            Contact: <a href="https://x.com/alhrkn" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline">@alhrkn</a>
          </div>
        </div>
      </div>
    </>
  )
}
