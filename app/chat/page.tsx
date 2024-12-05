'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Image } from 'lucide-react'
import Together from 'together-ai'
import ReactMarkdown from 'react-markdown'
import { Sidebar } from '@/components/Sidebar'

// Initialize Together AI client
const together = new Together({ apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY })

interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string | Array<{
        type: 'text' | 'image_url'
        text?: string
        image_url?: {
            url: string
        }
    }>
}

export default function MinimalistChatbot() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [localImageUrl, setLocalImageUrl] = useState<string | null>(null)

    const titleSection = (
        <div className="text-center py-8">
            <h1 className="text-4xl font-bold mb-2">
                <span className="text-blue-600">Disposable</span> AI Chat
            </h1>
            <p className="text-gray-600">
                No limits. <span className="text-blue-600">Not recorded</span>. Reload to start fresh.
            </p>
        </div>
    )

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
    const handleRemoveImage = () => {
        setTempImageUrl(null);
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            // Create local preview immediately
            const localUrl = URL.createObjectURL(file)
            setLocalImageUrl(localUrl)
            setIsUploading(true)

            try {
                const formData = new FormData()
                formData.append('file', file)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) throw new Error('Upload failed')

                const { url } = await response.json()
                setTempImageUrl(url)
            } catch (error) {
                console.error('Error uploading image:', error)
            } finally {
                setIsUploading(false)
            }
        }
    }

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [localImageUrl, tempImageUrl])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if ((!input.trim() && !tempImageUrl) || isLoading) return

        // If an image is selected but Cloudinary URL is not ready, wait for it
        if (localImageUrl && !tempImageUrl) {
            console.log('Waiting for image upload to complete...');
            // Wait for up to 10 seconds for the upload to complete
            let attempts = 0;
            while (!tempImageUrl && attempts < 20 && isUploading) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
                attempts++;
            }

            if (!tempImageUrl) {
                console.error('Image upload timed out');
                return;
            }
        }

        const userMessage = {
            role: 'user' as const,
            content: [
                ...(input.trim() ? [{ type: 'text' as const, text: input }] : []),
                ...(tempImageUrl ? [{
                    type: 'image_url' as const,
                    image_url: {
                        url: tempImageUrl
                    }
                }] : [])
            ]
        };

        setMessages(prev => [...prev, userMessage])
        setInput('')
        // Clear both image URLs and revoke object URL
        if (localImageUrl) {
            URL.revokeObjectURL(localImageUrl);
            setLocalImageUrl(null);
        }
        setTempImageUrl(null)
        setIsLoading(true)

        try {
            const response = await together.chat.completions.create({
                messages: [
                    ...messages.map(msg => ({
                        role: msg.role,
                        content: Array.isArray(msg.content) ? msg.content : [{ type: 'text', text: msg.content }]
                    })),
                    userMessage
                ],
                model: 'meta-llama/Llama-Vision-Free',
                max_tokens: 1024,
                temperature: 0.7,
                top_p: 0.7,
                top_k: 50,
                repetition_penalty: 1,
                stop: ['<|eot_id|>', '<|eom_id|>'],
                stream: true
            });

            let assistantMessage = ''
            const userMessages = [...messages, userMessage]
            setMessages(userMessages)

            for await (const token of response) {
                const content = token.choices[0]?.delta?.content
                if (content) {
                    assistantMessage += content
                    setMessages([
                        ...userMessages,
                        { role: 'assistant', content: assistantMessage }
                    ])
                }
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Sidebar />
            <div className="flex flex-col h-screen bg-white w-full">
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        {titleSection}
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-4xl mx-auto w-full p-4 md:p-6">
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                        <div
                                            className={`max-w-[80%] rounded-2xl p-3 ${message.role === 'user'
                                                ? 'bg-blue-500 text-white rounded-br-none'
                                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                                }`}
                                        >
                                            {message.role === 'assistant' ? (
                                                <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                                                    {typeof message.content === 'string'
                                                        ? message.content
                                                        : message.content.map((content, i) =>
                                                            content.type === 'text'
                                                                ? content.text
                                                                : content.image_url?.url
                                                                    ? `![Image](${content.image_url.url})`
                                                                    : ''
                                                        ).join('\n')}
                                                </ReactMarkdown>
                                            ) : (
                                                typeof message.content === 'string'
                                                    ? message.content
                                                    : message.content.map((content, i) => (
                                                        <div key={i}>
                                                            {content.type === 'text' && content.text}
                                                            {content.type === 'image_url' && content.image_url?.url && (
                                                                <img
                                                                    src={content.image_url.url}
                                                                    alt="Uploaded content"
                                                                    className="max-w-full max-h-[250px] w-auto h-auto object-contain rounded-lg mt-2"
                                                                />
                                                            )}
                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                )}

                <div className="w-full border-t border-gray-200 bg-white">
                    <form onSubmit={handleSubmit} className="p-4">
                        {(localImageUrl || tempImageUrl) && (
                            <div className="mb-4 flex justify-center">
                                <div className="relative bg-white p-2 rounded-lg shadow-md inline-block">
                                    <img
                                        src={localImageUrl || tempImageUrl || undefined}
                                        alt="Preview"
                                        className={`h-20 w-20 object-cover rounded-lg transition-opacity duration-200 ${isUploading ? 'opacity-50' : 'opacity-100'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleRemoveImage();
                                            if (localImageUrl) {
                                                URL.revokeObjectURL(localImageUrl);
                                                setLocalImageUrl(null);
                                            }
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                        style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center bg-white rounded-full shadow-md max-w-4xl mx-auto border border-gray-200">
                            <button
                                type="button"
                                onClick={handleImageClick}
                                className="p-3 pl-4 hover:bg-gray-100 focus:outline-none rounded-l-full"
                            >
                                <Image className="w-5 h-5 text-gray-500" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 p-3 pl-6 rounded-l-full focus:outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="p-3 pr-4 rounded-r-full hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                                disabled={isLoading}
                            >
                                <Send className="w-5 h-5 text-blue-500" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}