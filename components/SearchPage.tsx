"use client";

import { Search, Mail, Share2, Wand2, Palette, Shapes, Layers, Paintbrush, ImageIcon, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import CustomSearchInput from "./CustomSearchInput";

interface SearchPageProps {
    initialQuery: string;
}

const defaultIcons = {
    Wand2,
    Palette,
    Shapes,
    Layers,
    Paintbrush,
    ImageIcon
};

const getRandomIcon = () => {
    const icons = Object.values(defaultIcons);
    return icons[Math.floor(Math.random() * icons.length)];
};

interface SearchResult {
    title: string;
    summary: string;
    url: string;
    image?: string;
}

export default function SearchPage({ initialQuery }: SearchPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Initialize states
    const [query, setQuery] = useState(initialQuery || "");
    const [searchResults, setSearchResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedResultIndex, setExpandedResultIndex] = useState<number | null>(null);

    // generate and memoize random icons for each result
    const resultIcons = useMemo(() => {
        if (!searchResults) return [];
        return searchResults.results.map(() => getRandomIcon());
    }, [searchResults?.results]); // only regenerate when results change

    // Effect to sync URL query parameter with state
    useEffect(() => {
        const urlQuery = searchParams.get('q');
        if (urlQuery !== query) {
            setQuery(urlQuery || "");
            if (urlQuery) {
                handleSearch(urlQuery, false);
            } else {
                setSearchResults(null);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (query && searchResults) {
            document.title = `Search: ${query} | enaiblr`;
        } else {
            document.title = 'enaiblr - AI Tools Finder';
        }
    }, [query, searchResults]);

    const handleSearch = useCallback(async (searchQuery: string, updateURL: boolean = true) => {
        setIsLoading(true);
        setError(null);
        setExpandedResultIndex(null);

        const searchParams = {
            type: 'neural',
            useAutoprompt: true,
            numResults: 15,
            summary: true,
        };

        try {
            if (updateURL) {
                router.push(`/?q=${encodeURIComponent(searchQuery)}`, { scroll: false });
            }

            const response = await fetch("/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: searchQuery, ...searchParams }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch results");
            }

            const results = await response.json();
            setSearchResults(results);
        } catch (error: any) {
            console.error("Search error:", error);
            setError(error.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const handleBackToHome = () => {
        router.replace("/", { scroll: false });
        setSearchResults(null);
        setQuery("AI Tools for Graphic Design");
    };

    const clearSearch = () => {
        setQuery("AI Tools for ");
    };

    const tags = [
        "brainstorming", "voice over", "research", "copywriting", "coding",
        "content marketing", "music", "photo generator", "productivity", "automation",
        "note-taking", "graphic design", "video editing", "learning", "meme", "presentation",
    ];

    const handleTagSearch = useCallback((tag: string) => {
        const newQuery = `AI Tools for ${tag}`;
        setQuery(newQuery);
        handleSearch(newQuery);
    }, [handleSearch]);

    const handleResultClick = useCallback((index: number) => {
        setExpandedResultIndex(prev => prev === index ? null : index);
    }, []);

    const renderHeader = () => (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={handleBackToHome}
                    className="text-2xl font-bold tracking-tighter shrink-0 mb-0 sm:mb-0">
                    en<span className="text-blue-600">ai</span>blr
                </button>
                <div className="relative flex-1 max-w-xl w-full flex items-center">
                    <div className="relative flex-1">
                        <CustomSearchInput
                            className="w-full h-10 rounded-full text-sm"
                            value={query.replace(/^AI Tools for /, '')}
                            onChange={(value) => setQuery(value)}
                            onKeyUp={(e) => e.key === 'Enter' && handleSearch(query)}
                            onClear={() => clearSearch()}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        className="rounded-full ml-2 hidden sm:flex"
                        onClick={() => handleSearch(query)}
                    >
                        Search
                    </Button>
                </div>
            </div>
        </header>
    );

    const renderFooter = () => (
        <footer className="py-3 text-center text-sm text-muted-foreground bg-gray-100">
            <p>
                Created by{" "}
                <a href="https://x.com/alhrkn" className="underline" target="_blank" rel="noopener noreferrer">
                    @alhrkn
                </a>{" "}
                |{" "}
                <a href="mailto:enaiblr@gmail.com" target="_blank" rel="noopener noreferrer">
                    Report a Bug
                </a>
            </p>
        </footer>
    );

    // Show results view when we have results or are loading
    if (searchResults || isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                {renderHeader()}
                <main className="container mx-auto px-5 py-8 flex-1">
                    {isLoading ? (
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Skeleton Loading... */}
                            {Array.from({ length: 8 }, (_, index) => (
                                <div key={index} className="p-4 rounded-xl border bg-card flex gap-4 animate-pulse">
                                    <div className="w-16 h-16 bg-muted rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                        <div className="h-4 bg-muted rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                            {searchResults.results.map((result: SearchResult, index: number) => {
                                const IconComponent = resultIcons[index];
                                const isExpanded = expandedResultIndex === index;

                                return (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl border bg-card hover:bg-accent transition-colors flex gap-4 cursor-pointer"
                                        onClick={() => handleResultClick(index)}
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
                                            <h2 className="text-sm font-bold">{result.title}</h2>
                                            <p className={`text-xs text-muted-foreground mt-1 ${!isExpanded ? "line-clamp-3" : ""}`}>
                                                {result.summary || "No description available"}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <a
                                                    href={result.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-bold text-blue-800 hover:text-blue-900"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {new URL(result.url).hostname.replace('www.', '')}  ↗
                                                </a>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    {isExpanded ? (
                                                        <>
                                                            <ChevronUp className="h-4 w-4" />
                                                            <span>Show less</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="h-4 w-4" />
                                                            <span>Show more</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
                {renderFooter()}
            </div>
        );
    }

    // Show home view
    return (
        <div className="min-h-screen flex flex-col">
            <a href="mailto:enaiblr@gmail.com">
                <div className="absolute top-4 right-4">
                    <Button variant="secondary" className="rounded-full px-6 hidden sm:flex">
                        Contact
                    </Button>
                    <Button variant="secondary" className="rounded-full sm:hidden" aria-label="Contact">
                        <Mail className="h-5 w-5" />
                    </Button>
                </div>
            </a>

            <main className="flex-1 flex flex-col items-center justify-center px-4 gap-8">
                <div className="text-center space-y-2">
                    <h1 className="text-5xl tracking-tighter ibm-plex-mono-bold">
                        en<span className="text-blue-600">ai</span>blr
                    </h1>
                    <p className="text-l text-muted-foreground ibm-plex-mono-light">AI Tools Finder</p>
                </div>

                <div className="w-full max-w-xl space-y-4">
                    <div className="relative">
                        <CustomSearchInput
                            className="w-full h-12 rounded-full"
                            value={query.replace(/^AI Tools for /, '')}
                            onChange={(value) => setQuery(value)}
                            onKeyUp={(e) => e.key === 'Enter' && handleSearch(query)}
                            onClear={() => clearSearch()}
                        />
                    </div>
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="secondary"
                            className="rounded-full px-6"
                            onClick={() => query.trim() !== '' && handleSearch(query)}
                            disabled={isLoading}
                        >
                            {isLoading ? "Searching..." : "Search"}
                        </Button>
                        <Button
                            variant="secondary"
                            className="rounded-full px-6"
                            onClick={() => handleTagSearch(tags[Math.floor(Math.random() * tags.length)])}
                        >
                            Surprise Me
                        </Button>
                    </div>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <div className="flex flex-wrap justify-center gap-2 max-w-2xl mt-6">
                    {tags.map((tag) => (
                        <Button
                            key={tag}
                            variant="outline"
                            className="rounded-full text-sm h-8 hover:bg-secondary"
                            onClick={() => handleTagSearch(tag)}
                        >
                            {tag} ↗
                        </Button>
                    ))}
                </div>
            </main>

            {renderFooter()}
        </div>
    );
}