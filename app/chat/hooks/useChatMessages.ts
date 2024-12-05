import { useState } from 'react';
import Together from 'together-ai';
import { Message } from '../components/types';

const together = new Together({ apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY });

export function useChatMessages() {
    const [messages, setMessages] = useState<(Message)[]>([]);
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
            const response = await together.chat.completions.create({
                messages: [...messages.map(toTogetherMessage), toTogetherMessage(userMessage)],
                model: 'meta-llama/Llama-Vision-Free',
                max_tokens: 1024,
                temperature: 0.7,
                top_p: 0.7,
                top_k: 50,
                repetition_penalty: 1,
                stop: ['<|eot_id|>', '<|eom_id|>'],
                stream: true
            });

            let assistantMessage = '';
            const userMessages = [...messages, userMessage];
            setMessages(userMessages);

            for await (const token of response) {
                const content = token.choices[0]?.delta?.content;
                if (content) {
                    assistantMessage += content;
                    setMessages([
                        ...userMessages,
                        { role: 'assistant', content: assistantMessage }
                    ]);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        sendMessage
    };
}