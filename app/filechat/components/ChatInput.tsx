import { Send, FileText } from 'lucide-react'
import { useRef } from 'react'

interface ChatInputProps {
    input: string;
    setInput: (input: string) => void;
    isLoading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoFocus?: boolean;
    fileContent: string | null;
    clearFile: () => void;
    sendMessage: (text: string, fileContent: string | null) => Promise<void>;
    isFirstMessage: boolean;
}

export function ChatInput({ 
    input, 
    setInput, 
    isLoading, 
    fileInputRef, 
    onFileSelect, 
    autoFocus,
    fileContent,
    clearFile,
    sendMessage,
    isFirstMessage
}: ChatInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        inputRef.current?.blur();
        
        const currentFileContent = fileContent;
        
        clearFile();
        setInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        await sendMessage(input, currentFileContent);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="flex items-center bg-white rounded-full shadow-md max-w-4xl mx-auto border border-gray-200">
                {isFirstMessage && (
                    <div className="shrink-0">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onFileSelect}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt,.md"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 hover:text-blue-500 transition-colors"
                            aria-label="Attach document"
                        >
                            <FileText className="h-6 w-6" />
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.md"
                    className="hidden"
                />

                <input
                    type="text"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 bg-transparent focus:outline-none min-w-0"
                    autoFocus={autoFocus}
                />

                <div className="shrink-0">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`p-3 pr-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} focus:outline-none rounded-r-full`}
                    >
                        <Send className="w-6 h-6 text-blue-500" />
                    </button>
                </div>
            </div>
        </form>
    );
}