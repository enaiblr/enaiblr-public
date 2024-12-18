import { useState } from 'react';
import { Message } from '../components/types';

export function useChatMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const clearMessages = () => {
        setMessages([]);
        setIsLoading(false);
    };

    const toTogetherMessage = (msg: Message): any => ({
        role: msg.role,
        content: msg.content
    });

    const sendMessage = async (input: string) => {
        if ((!input.trim()) || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: [{ type: 'text' as const, text: input.trim() }]
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/web', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                })
            });

            if (!response.ok) throw new Error('Failed to send message');

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            const textDecoder = new TextDecoder();
            const { done, value } = await reader.read();
            if (!done && value) {
                const chunk = textDecoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const { content } = JSON.parse(line.slice(6));
                            if (content) {
                                setMessages(prev => [
                                    ...prev,
                                    {
                                        role: 'assistant',
                                        content: [{ type: 'text', text: content }]
                                    }
                                ]);
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, sendMessage, clearMessages };
}