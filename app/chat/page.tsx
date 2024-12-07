'use client'

import { useState, useRef, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { ChatTitle } from './components/ChatTitle'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { ImagePreview } from './components/ImagePreview'
import { useImageUpload } from './hooks/useImageUpload'
import { useChatMessages } from './hooks/useChatMessages'
import { AnimatedBackground } from "../../components/animated-background"
import RenderFooter from '@/components/RenderFooter'

export default function MinimalistChatbot() {
    const { messages, isLoading, sendMessage, clearMessages } = useChatMessages();
    const {
        isUploading,
        localImageUrl,
        tempImageUrl,
        clearImages,
        handleImageChange,
    } = useImageUpload();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState('');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, localImageUrl, tempImageUrl])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentTempImageUrl = tempImageUrl; // Store the URL before clearing

        // Clear images and input immediately
        clearImages();
        setInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Send message with the stored URL
        await sendMessage(input, currentTempImageUrl);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleImageChange(e.target.files?.[0] ?? null);
    };

    return (
        <>
            <Sidebar />
            <AnimatedBackground />
            <div className="flex flex-col h-screen w-full min-w-[320px] mx-auto">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
                        <ChatTitle clearMessages={clearMessages} />
                        <div className="w-full max-w-3xl mt-8">
                            {(localImageUrl || tempImageUrl) && (
                                <ImagePreview
                                    localImageUrl={localImageUrl}
                                    tempImageUrl={tempImageUrl}
                                    isUploading={isUploading}
                                    onRemove={() => {
                                        clearImages();
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                />
                            )}
                            <ChatInput
                                input={input}
                                setInput={setInput}
                                isLoading={isLoading}
                                onSubmit={handleSubmit}
                                fileInputRef={fileInputRef}
                                onImageSelect={handleFileChange}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <ChatTitle compact clearMessages={clearMessages} />
                        <MessageList
                            messages={messages}
                            messagesEndRef={messagesEndRef}
                        />
                        <div className="w-full border-gray-200">
                            {(localImageUrl || tempImageUrl) && (
                                <ImagePreview
                                    localImageUrl={localImageUrl}
                                    tempImageUrl={tempImageUrl}
                                    isUploading={isUploading}
                                    onRemove={() => {
                                        clearImages();
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                />
                            )}
                            <ChatInput
                                input={input}
                                setInput={setInput}
                                isLoading={isLoading}
                                onSubmit={handleSubmit}
                                fileInputRef={fileInputRef}
                                onImageSelect={handleFileChange}
                            />
                        </div>
                    </>
                )}
                {messages.length === 0 && (
                    <div className="mt-8 sm:mt-20">
                        <RenderFooter />
                    </div>
                )}
            </div>
        </>
    )
}