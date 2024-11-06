import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ToolCardProps {
  title: string;
  description: string;
  image: string;
}

export function ToolCard({ title, description, image }: ToolCardProps) {
  const router = useRouter();

  const handleLaunch = () => {
    const path = title.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${path}`);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
        <div className="mt-4">
          <Button className="w-full" onClick={handleLaunch}>
            Launch Tool
          </Button>
        </div>
      </div>
    </Card>
  );
}