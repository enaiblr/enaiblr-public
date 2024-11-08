"use client";

import { Search, Share, Wand2, Palette, Shapes, Layers, Paintbrush, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Exa from "exa-js";
import { useState } from "react";

const exa = new Exa(process.env.NEXT_PUBLIC_EXA_API_KEY);

// Default icon mapping
const defaultIcons = {
  Wand2,
  Palette,
  Shapes,
  Layers,
  Paintbrush,
  ImageIcon
};

// Function to get a random icon
const getRandomIcon = () => {
  const icons = Object.values(defaultIcons);
  return icons[Math.floor(Math.random() * icons.length)];
};

export default function Component() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await exa.searchAndContents(query, {
        type: "neural",
        useAutoprompt: true,
        numResults: 20,
        highlights: true,
      });
      setSearchResults(result);
    } catch (err: any) {
      console.error("Error searching:", err);
      setError(err.message || "An error occurred during the search.");
    } finally {
      setIsLoading(false);
    }
  };

  // If we have search results, show the results view
  if (searchResults && !isLoading && !error) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-center items-center gap-4">
            <Link href="/" className="text-2xl font-bold tracking-tighter shrink-0">
              en<span className="text-blue-600">ai</span>blr
            </Link>
            
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input 
                className="w-full pl-10 pr-4 h-10 rounded-full text-sm" 
                placeholder="Search AI tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
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
        
        <main className="container mx-auto px-5 py-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.results.map((result: any, index: number) => {
              const IconComponent = getRandomIcon();
              return (
                <a
                  key={index}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border bg-card hover:bg-accent transition-colors flex gap-4"
                >
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-primary shrink-0">
                    {result.image ? (
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <IconComponent className="w-8 h-8" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h2 className="text-sm font-semibold">{result.title}</h2>
                    <p className="text-xs text-muted-foreground">
                      {result.highlights?.[0] || "No description available"}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </main>

        <footer className="py-4 text-center text-sm text-muted-foreground border-t">
          <p>
            Created by{" "}
            <a href="#" className="underline">
              @alhrkn
            </a>{" "}
            |{" "}
            <a href="#" className="underline">
              Report a Bug
            </a>
          </p>
        </footer>
      </div>
    );
  }

  // Otherwise, show the search view
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
            <Input
              className="w-full pl-10 h-12 rounded-full"
              placeholder="Search AI tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="flex justify-center gap-3">
            <Button
              variant="secondary"
              className="rounded-full px-6"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
            <Button variant="secondary" className="rounded-full px-6">
              Surprise Me
            </Button>
          </div>
        </div>

        {isLoading && <p>Searching...</p>}
        {error && <p className="text-red-500">{error}</p>}

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
            @alhrkn
          </a>{" "}
          |{" "}
          <a href="#" className="underline">
            Report a Bug
          </a>
        </p>
      </footer>
    </div>
  );
}