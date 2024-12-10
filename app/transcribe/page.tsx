'use client'

import { useState, useRef, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { AnimatedBackground } from "../../components/animated-background"
import RenderFooter from '@/components/RenderFooter'
import { UploadForm } from './components/UploadForm';
import { TranscriptionResult } from './components/TranscriptionResult';
import type { TranscriptionResult as TranscriptionResultType } from './types';

export default function Transcriber() {
    const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResultType | null>(null);

    return (
        <>
            <Sidebar />
            <AnimatedBackground />
            <div className="flex flex-col min-h-screen">
                <div className={`flex-grow ${transcriptionResult ? 'pt-28 pb-12' : 'flex items-center justify-center py-12'}`}>
                    {transcriptionResult ? (
                        <TranscriptionResult result={transcriptionResult} />
                    ) : (
                        <UploadForm onTranscriptionComplete={setTranscriptionResult} />
                    )}
                </div>
                <div className="w-full">
                    <RenderFooter />
                </div>
            </div>
        </>
    )
}