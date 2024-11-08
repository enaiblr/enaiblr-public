"use client";

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link";

export default function Component() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <Button variant="secondary" className="rounded-full px-6">
          Contact
        </Button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold tracking-tighter">
            en<span className="text-blue-600">ai</span>blr
          </h1>
          <p className="text-xl text-muted-foreground">AI Tools Search Engine</p>
        </div>

        <div className="w-full max-w-xl space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input className="w-full pl-10 h-12 rounded-full" placeholder="Search AI tools..." />
          </div>

          <div className="flex justify-center gap-3">
            <Link href="/search-result">
              <Button variant="secondary" className="rounded-full px-6">
                Search
              </Button>
            </Link>
            <Button variant="secondary" className="rounded-full px-6">
              Surprise Me
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
          {[
            "brainstorming ↗", "voice over ↗", "research ↗", "copywriting ↗", "coding ↗",
            "content marketing ↗", "music ↗", "photo generator ↗", "productivity ↗", "automation ↗",
            "note-taking ↗", "graphic design ↗", "video editing ↗", "learning ↗"
          ].map((tag) => (
            <Button
              key={tag}
              variant="outline"
              className="rounded-full text-sm h-8 hover:bg-secondary"
            >
              {tag}
            </Button>
          ))}
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>
          Created by{" "}
          <a href="#" className="underline">
            @altrkn
          </a>{" "}
          |{" "}
          <a href="#" className="underline">
            Report a Bug
          </a>
        </p>
      </footer>
    </div>
  )
}