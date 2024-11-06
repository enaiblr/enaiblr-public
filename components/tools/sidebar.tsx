"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Boxes, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
}: SidebarProps) {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-card border-r shadow-lg transition-transform duration-300 ease-in-out z-50",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center space-x-2">
            <Boxes className="h-6 w-6" />
            <h2 className="font-semibold">Tools Hub</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className="p-4 space-y-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectCategory(category)}
              >
                <ChevronRight
                  className={cn(
                    "mr-2 h-4 w-4 transition-transform",
                    selectedCategory === category ? "rotate-90" : ""
                  )}
                />
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}