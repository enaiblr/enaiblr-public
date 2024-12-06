"use client"

import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { ImageForm } from "../components/image-form"
import { AnimatedBackground } from "../components/animated-background"
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const prompt = searchParams.get('prompt') || ""
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const hasGeneratedRef = useRef(false)

  useEffect(() => {
    const generateImage = async () => {
      if (!prompt) return;
      
      // Only prevent regeneration if we already have an image and state isn't 'new'
      const state = searchParams.get('state');
      if (generatedImage && (!state || state !== 'new')) return;

      setIsGenerating(true);
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            width: 1024,
            height: 1024
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate image');
        }

        const data = await response.json();
        if (data.imageData) {
          setGeneratedImage(data.imageData);
          // Remove the state parameter from URL after successful generation
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.delete('state');
          router.replace(`/imagen/results?${newParams.toString()}`, { scroll: false });
        } else {
          throw new Error('No image data received from API');
        }
      } catch (error: any) {
        console.error('Failed to generate image:', error);
        setError(error.message);
      } finally {
        setIsGenerating(false);
        setIsLoading(false);
      }
    };

    generateImage();
  }, [prompt, searchParams, router, generatedImage]);

  const handleRegenerate = async (newPrompt: string) => {
    // Reset all states
    hasGeneratedRef.current = false;
    setGeneratedImage(null);
    setIsLoading(true);
    setIsGenerating(false);
    setError(null);

    const searchParams = new URLSearchParams({
      prompt: newPrompt,
      state: 'new'
    });
    
    router.push(`/imagen/results?${searchParams.toString()}`, { scroll: false });
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = `data:image/png;base64,${generatedImage}`
      link.download = 'generated-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <AnimatedBackground />
      <div className="w-full max-w-3xl space-y-8">
        <div className="relative rounded-lg overflow-hidden group">
          {generatedImage ? (
            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt="Generated image"
              className="w-full h-auto max-h-[60vh] object-contain bg-white/50 backdrop-blur-sm"
            />
          ) : (
            <div className="w-full h-[60vh] flex items-center justify-center bg-white/50 backdrop-blur-sm">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500">Generating your image...</p>
                </div>
              ) : (
                <p className="text-gray-500">Generate an image to see the result</p>
              )}
            </div>
          )}
          {generatedImage && (
            <Button
              size="icon"
              variant="secondary"
              onClick={handleDownload}
              className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ImageForm
          defaultPrompt={prompt}
          onGenerate={handleRegenerate}
        />
      </div>
    </div>
  )
}