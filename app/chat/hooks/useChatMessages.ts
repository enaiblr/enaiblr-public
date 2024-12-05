import { useState } from 'react';
import { Message } from '../components/types';

export function useChatMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const toTogetherMessage = (msg: Message): any => ({
        role: msg.role,
        content: msg.content
    });

    const sendMessage = async (input: string, imageUrl: string | null) => {
        if ((!input.trim() && !imageUrl) || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: imageUrl ? [
                { type: 'text' as const, text: input.trim() },
                { type: 'image_url' as const, image_url: { url: imageUrl } }
            ] : [{ type: 'text' as const, text: input.trim() }]
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages.map(toTogetherMessage), toTogetherMessage(userMessage)],
                    imageUrl
                })
            });

            if (!response.ok) throw new Error('Failed to send message');

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            let assistantMessage = '';
            const userMessages = [...messages, userMessage];
            setMessages(userMessages);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = new TextDecoder().decode(value);
                try {
                    const parsed = JSON.parse(chunk);
                    const content = parsed.choices[0]?.delta?.content;
                    if (content) {
                        assistantMessage += content;
                        setMessages([
                            ...userMessages,
                            {
                                role: 'assistant',
                                content: [{ type: 'text', text: assistantMessage }]
                            }
                        ]);
                    }
                } catch (e) {
                    // Handle parsing errors
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, sendMessage };
}