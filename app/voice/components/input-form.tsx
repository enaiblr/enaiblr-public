"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InputFormProps {
  text: string;
  language: string;
  onTextChange: (text: string) => void;
  onLanguageChange: (language: string) => void;
  onSubmit: () => void;
}

export function InputForm({
  text,
  language,
  onTextChange,
  onLanguageChange,
  onSubmit,
}: InputFormProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-5xl font-bold text-center mb-8">
        Text to <span className="text-blue-600">Voice AI</span>
      </h1>      
      <Textarea
        placeholder="Enter your text here..."
        className="min-h-[200px] text-lg"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="en-GB">English (UK)</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          className="w-full sm:flex-1"
          onClick={onSubmit}
          disabled={!text.trim()}
        >
          Convert to Audio
        </Button>
      </div>
    </div>
  );
}