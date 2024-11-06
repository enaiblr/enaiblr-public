"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ToolCard } from "@/components/tools/tool-card";
import { Sidebar } from "@/components/tools/sidebar";
import { Header } from "@/components/tools/header";
import { tools, categories } from "@/lib/data";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Tools");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "pl-0"
        )}
      >
        <Header
          title={selectedCategory}
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter(
                (tool) =>
                  selectedCategory === "All Tools" ||
                  tool.category === selectedCategory
              )
              .map((tool, index) => (
                <ToolCard
                  key={index}
                  title={tool.title}
                  description={tool.description}
                  image={tool.image}
                />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}