import { useState } from 'react';
import { Message } from '../components/types';

export function useChatMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const clearMessages = () => {
        setMessages([]);
        setIsLoading(false);
    };

    const sendMessage = async (input: string) => {
        if ((!input.trim()) || isLoading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send message');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            const textDecoder = new TextDecoder();
            let receivedResponse = false;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                if (value) {
                    const chunk = textDecoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.answer) {
                                    receivedResponse = true;
                                    const assistantMessage: Message = {
                                        id: crypto.randomUUID(),
                                        role: 'assistant',
                                        content: [{ 
                                            type: 'text' as const, 
                                            text: data.answer 
                                        }],
                                        sources: data.results
                                    };
                                    setMessages(prev => [...prev, assistantMessage]);
                                }
                            } catch (e) {
                                console.error('Error parsing SSE data:', e);
                                throw new Error('Failed to parse server response');
                            }
                        }
                    }
                }
            }

            if (!receivedResponse) {
                throw new Error('No response received from server');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, sendMessage, clearMessages };
}