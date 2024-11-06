"use client";

import { useState } from "react";
import { Header } from "@/components/tools/header";
import { Sidebar } from "@/components/tools/sidebar";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Code2, Copy, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

export default function CodeGenerator() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedCode(`// Generated TypeScript code
interface User {
  id: string;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];

  constructor() {
    this.users = [];
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    const newUser: User = {
      id: crypto.randomUUID(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }
}
`);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        selectedCategory="Development"
        onSelectCategory={() => {}}
      />

      <main className={cn(
        "transition-all duration-300",
        sidebarOpen ? "lg:pl-64" : "pl-0"
      )}>
        <Header
          title="Code Generator"
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div className="p-6 max-w-[1200px] mx-auto">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">AI Code Generator</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Target Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Describe what you want to generate</label>
                <Textarea
                  placeholder="E.g., Create a User class with CRUD operations..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-32"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Code"}
              </Button>

              {generatedCode && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Generated Code</label>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{generatedCode}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}