'use client'

import { useState, useRef, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { AnimatedBackground } from "../../components/animated-background"
import RenderFooter from '@/components/RenderFooter'
import TextToVoiceConverter from './components/text-to-voice-converter'

export default function Voice() {

    return (
        <>
            <Sidebar />
            <AnimatedBackground />
            <div className="flex flex-col min-h-screen">
                <div className="flex flex-grow items-center justify-center py-12">
                <TextToVoiceConverter />
                </div>
                <div className="w-full">
                    <RenderFooter />
                </div>
            </div>
        </>
    )
}