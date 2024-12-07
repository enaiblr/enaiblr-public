'use client'

import { Sidebar } from '@/components/Sidebar'
import { ImageForm } from "./components/image-form"
import { AnimatedBackground } from "../../components/animated-background"
import { EXAMPLE_PROMPTS } from "./components/constants"
import RenderFooter from '@/components/RenderFooter'
import { useState } from 'react'
import { Download } from 'lucide-react';

export default function Home() {
  const [defaultPrompt, setDefaultPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'wide' | 'square' | 'portrait'>('square')
  const [imageAspectRatio, setImageAspectRatio] = useState<'wide' | 'square' | 'portrait'>('square')

  const handleGenerateStart = () => {
    setIsGenerating(true)
    setGeneratedImage(null)
  }

  const handleGenerate = (prompt: string, imageData?: string) => {
    setIsGenerating(false)
    if (imageData) {
      setGeneratedImage(`data:image/png;base64,${imageData}`)
      setImageAspectRatio(selectedAspectRatio) // Set the image aspect ratio when new image is generated
    }
  }

  const getAspectRatioClass = (aspectRatio: 'wide' | 'square' | 'portrait') => {
    switch (aspectRatio) {
      case 'wide': return 'aspect-video'
      case 'portrait': return 'aspect-[9/16]'
      default: return 'aspect-square'
    }
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-col items-center justify-between h-screen p-4">
        <AnimatedBackground />
        <div className="flex-1 flex flex-col items-center justify-center w-full pt-16 sm:pt-8">
          {isGenerating ? (
            <div className="relative w-full max-w-[640px] flex items-center justify-center h-[50vh] mx-auto mb-8">
              <div className={getAspectRatioClass(imageAspectRatio)} style={{ maxWidth: '100%', maxHeight: '100%' }}>
                <div className="absolute inset-0 w-full h-full object-contain rounded-lg flex flex-col items-center justify-center bg-white/40 backdrop-blur">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                  <p className="text-gray-600 font-medium">Creating Visual</p>
                </div>
              </div>
            </div>
          ) : !generatedImage ? (
            <div className="flex items-center justify-center py-8 mt-8 sm:mt-0">
              <h1 className="text-4xl sm:text-6xl font-bold mb-12 text-center">
                Realize <span className="text-blue-500">Imagination</span>
              </h1>
            </div>
          ) : (
            <div className="relative w-full max-w-[640px] flex items-center justify-center h-[50vh] mx-auto mb-8">
            <div className={`relative ${getAspectRatioClass(imageAspectRatio)}`} style={{ maxWidth: '100%', maxHeight: '100%' }}>
              <img
                src={generatedImage}
                alt="Generated image"
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImage;
                  link.download = 'generated-image.png';
                  link.click();
                }}
                className="absolute bottom-2 right-2 p-2 bg-white/30 backdrop-blur-sm hover:bg-white/50 rounded-full transition-colors"
              >
                <Download className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
          )}

          <div className="w-full max-w-3xl space-y-8">
            <ImageForm
              defaultPrompt={defaultPrompt}
              onGenerateStart={handleGenerateStart}
              onGenerate={handleGenerate}
              onAspectRatioChange={setSelectedAspectRatio}
            />

            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLE_PROMPTS.map((examplePrompt) => (
                <button
                  key={examplePrompt}
                  onClick={() => setDefaultPrompt(examplePrompt)}
                  className="px-4 py-2 text-sm bg-white/80 backdrop-blur-sm rounded-full border hover:bg-white/90 transition-colors"
                >
                  <span className="text-xs">{examplePrompt} →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 sm:mt-20">
          <RenderFooter />
        </div>
      </div>
    </>
  )
}