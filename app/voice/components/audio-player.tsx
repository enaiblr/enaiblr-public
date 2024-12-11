"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(150); // 2:30 in seconds
  const [visualizerData, setVisualizerData] = useState<number[]>([]);

  useEffect(() => {
    // Generate random visualization data
    setVisualizerData(Array.from({ length: 50 }, () => Math.random() * 100));
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg">
      <div className="h-24 w-full flex items-end space-x-1">
        {visualizerData.map((height, index) => (
          <div
            key={index}
            className={cn(
              "w-2 bg-primary/60 rounded-t",
              isPlaying && "animate-pulse"
            )}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={(value) => setCurrentTime(value[0])}
          className="w-full"
        />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
        >
          <SkipBack className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          className="h-12 w-12"
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}