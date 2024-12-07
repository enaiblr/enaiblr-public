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
                    messageContainer.scrollTo({
                        top: messageContainer.scrollHeight,
                        behavior: 'smooth'
                    });
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

    // Initial scroll and cleanup
    useEffect(() => {
        scrollToBottom();
        onUpdate();

        return () => {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, []);

    return (
        <div
            ref={messageListRef}
            className="flex-1 overflow-y-auto scrollbar-hide relative" // Added scrollbar-hide here
            style={{
                maxHeight: 'calc(100vh - 180px)',
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
                className="h-0 w-full"
                style={{ float: 'left', clear: 'both' }}
            />
        </div>
    );
}