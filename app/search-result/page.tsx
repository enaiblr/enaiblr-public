"use client";

import { Search, Share, Paintbrush, Wand2, Layers, Palette, Shapes, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const aiTools = [
  {
    name: "DesignGPT",
    description: "AI-powered design assistant for rapid prototyping and ideation",
    icon: Wand2
  },
  {
    name: "ColorMind AI",
    description: "Intelligent color palette generator for harmonious designs",
    icon: Palette
  },
  {
    name: "VectorForge",
    description: "AI tool for creating and editing vector graphics effortlessly",
    icon: Shapes
  },
  {
    name: "LayoutGenius",
    description: "Smart layout suggestions for balanced and aesthetic designs",
    icon: Layers
  },
  {
    name: "BrushStroke AI",
    description: "AI-assisted digital painting tool for stunning artwork",
    icon: Paintbrush
  },
  {
    name: "PhotoEnhance AI",
    description: "Automated photo enhancement and retouching using AI",
    icon: ImageIcon
  }
]

export default function Component() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tighter shrink-0">
            en<span className="text-blue-600">ai</span>blr
          </Link>
          
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input 
              className="w-full pl-10 pr-4 h-10 rounded-full text-sm" 
              placeholder="Search AI tools..."
              defaultValue="AI Tools for Graphic Design"
            />
          </div>

          <Button variant="secondary" className="rounded-full px-6 hidden sm:flex">
            Share
          </Button>
          <Button variant="secondary" className="rounded-full w-10 h-10 sm:hidden" aria-label="Share">
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiTools.map((tool, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border bg-card hover:bg-accent transition-colors flex gap-4"
            >
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-primary shrink-0">
                <tool.icon className="w-8 h-8" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h2 className="text-sm font-semibold">{tool.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
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