import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export function Header({ title, sidebarOpen, onOpenSidebar }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 border-b">
        <div className="flex items-center gap-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSidebar}
            className="shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-lg">{title}</h1>
        </div>
      </div>
    </div>
  );
}