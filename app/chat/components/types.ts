export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ImageMessage {
    role: 'user' | 'assistant' | 'system';
    content: Array<{
        type: 'text';
        text: string;
    } | {
        type: 'image_url';
        image_url: {
            url: string;
        };
    }>;
}