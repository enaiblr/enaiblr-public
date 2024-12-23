'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, Search, MessageSquare, Globe, BookOpen, Wallet, FlaskConical, WandSparkles, FileAudio, Speech, FileText} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SidebarProps {
  hasShownSidebarInSession: boolean
  onSidebarShown: () => void
}

const apps = [
  { name: 'AI Tools Search', icon: Search, slug: '' },
  { name: 'Disposable AI Chat', icon: MessageSquare, slug: 'chat' },
  { name: 'Image Creator', icon: WandSparkles, slug: 'imagen' },
  { name: 'Chat with Docs', icon: FileText, slug: 'filechat' },
  { name: 'Web Chat', icon: Globe, slug: 'web' },
  { name: 'Audio Transcription', icon: FileAudio, slug: 'transcribe' },
  { name: 'Text to Voice', icon: Speech, slug: 'voice' },
  // { name: 'Japanese Flashcard', icon: BookOpen, slug: 'japanese-flashcard' },
  // { name: 'Expense Tracker', icon: Wallet, slug: 'expense-tracker' },
  // { name: 'Science Creator', icon: FlaskConical, slug: 'science-creator' },
]


export function Sidebar({ hasShownSidebarInSession, onSidebarShown }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // First useEffect for auto-opening on homepage
  useEffect(() => {
    if (pathname === '/' && !hasShownSidebarInSession) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        onSidebarShown();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pathname, hasShownSidebarInSession, onSidebarShown]);

  // Second useEffect for handling click outside
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
        className="fixed top-3 left-3 z-50 p-2 rounded-lg"
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
            <a href="https://wa.me/+628128007690" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">Contact</a> | <Link href="https://raihankalla.id/enaiblr" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">About</Link>
          </div>
        </div>
      </div>
    </>
  )
}
