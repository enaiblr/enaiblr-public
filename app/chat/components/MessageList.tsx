import ReactMarkdown from 'react-markdown'
import { Message } from './types'
import { useEffect, useRef } from 'react'

interface MessageListProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onUpdate: () => void;
}

export function MessageList({ messages, messagesEndRef, onUpdate }: MessageListProps) {
    const scrollTimeout = useRef<NodeJS.Timeout>();
    const messageListRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messageListRef.current) {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }

            scrollTimeout.current = setTimeout(() => {
                const messageContainer = messageListRef.current;
                if (messageContainer) {
                    // For mobile devices
                    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                        const lastMessage = messageContainer.lastElementChild;
                        lastMessage?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'end',
                        });

                        // Additional scroll for mobile to ensure the input is visible
                        setTimeout(() => {
                            window.scrollTo({
                                top: document.body.scrollHeight,
                                behavior: 'smooth'
                            });
                        }, 100);
                    } else {
                        // For desktop
                        messageContainer.scrollTo({
                            top: messageContainer.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 100);
        }
    };

    // Watch for new messages and content changes
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant') {
                scrollToBottom();
            }
        }
    }, [messages, messages[messages.length - 1]?.content]);

    // Handle resize events (especially important for mobile keyboard)
    useEffect(() => {
        const handleResize = () => {
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                scrollToBottom();
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, []);

    return (
        <div
            ref={messageListRef}
            className="flex-1 overflow-y-auto scrollbar-hide relative"
            style={{
                maxHeight: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                    ? 'calc(100dvh - 180px)'
                    : 'calc(100vh - 180px)',
                overscrollBehavior: 'contain'
            }}
        >
            <div className="max-w-4xl mx-auto w-full p-4 md:p-6">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                            <div
                                className={`max-w-[80%] rounded-2xl p-3 break-words overflow-wrap-anywhere ${message.role === 'user'
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
                                            <div key={i} className="flex flex-col">
                                                {content.type === 'image_url' && content.image_url?.url && (
                                                    <img
                                                        src={content.image_url.url}
                                                        alt="Uploaded content"
                                                        className="max-w-full max-h-[250px] w-auto h-auto object-contain rounded-lg mb-2"
                                                    />
                                                )}
                                                {content.type === 'text' && content.text}
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                ref={messagesEndRef}
                style={{ height: '1px', visibility: 'hidden' }}
                aria-hidden="true"
            />
        </div>
    );
}