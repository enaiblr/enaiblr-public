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
    isUploading: boolean;
    wordCount: number;
    error: string | null;
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
    isFirstMessage,
    isUploading,
    wordCount,
    error
}: ChatInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isFirstMessage && !fileContent) {
            alert('Please attach a file first');
            return;
        }

        inputRef.current?.blur();
        const currentFileContent = fileContent;

        setInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        await sendMessage(input, currentFileContent);

        // Only clear the file input, but keep the fileInfo state for display
        // if (!isFirstMessage) {
        //     clearFile();
        // }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">

            <div className="flex items-center bg-white rounded-full shadow-md max-w-4xl mx-auto border border-gray-200">
                {isFirstMessage && (
                    <div className="shrink-0 p-2">
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
                            className={`p-3 pl-4 hover:bg-gray-100 rounded-l-full transition-colors ${!fileContent ? 'text-gray-400' : 'text-blue-600'}`}
                            title="Attach file"
                        >
                            <FileText className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {!isFirstMessage && (
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileSelect}
                        accept=".pdf,.doc,.docx,.txt,.md"
                        className="hidden"
                    />
                )}

                <input
                    type="text"
                    ref={inputRef}
                    onChange={onFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.md"
                    className="hidden"
                />

                <input
                    type="text"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Summarize this document..."
                    className="flex-1 p-3 bg-transparent focus:outline-none min-w-0"
                    autoFocus={autoFocus}
                />

                <div className="shrink-0">
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim() || wordCount > 80000}
                        className={`p-3 pr-4 mr-2 hover:bg-gray-100 rounded-r-full transition-colors ${isLoading || !input.trim() || wordCount > 80000
                            ? 'text-gray-400'
                            : 'text-blue-600'
                            }`}
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </div>



        </form>
    );
}