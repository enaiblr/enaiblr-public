"use client";

import { Clock, FileAudio, TextQuote, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AudioPlayer from "./audio-player";

interface ResultViewProps {
  text: string;
  onReset: () => void;
}

export function ResultView({ text, onReset }: ResultViewProps) {
  const wordCount = text.trim().split(/\s+/).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Audio is Ready</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center space-y-2">
          <Clock className="h-6 w-6 text-primary" />
          <p className="text-sm font-medium">Duration: 2:30</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center space-y-2">
          <TextQuote className="h-6 w-6 text-primary" />
          <p className="text-sm font-medium">{wordCount} Words</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center space-y-2">
          <FileAudio className="h-6 w-6 text-primary" />
          <p className="text-sm font-medium">2.5 MB</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center space-y-2">
          <Button 
            className="w-full" 
            onClick={() => {}}
            aria-label="Download audio file"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </Card>
      </div>

      <AudioPlayer />
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={onReset}
      >
        Convert Another Text
      </Button>
    </div>
  );
}