import { FileText, File } from 'lucide-react';

interface DocumentPreviewProps {
    fileName: string;
    fileType: string;
    isUploading: boolean;
    onRemove: () => void;
}

export function DocumentPreview({ fileName, fileType, isUploading, onRemove }: DocumentPreviewProps) {
    const getFileIcon = () => {
        switch(fileType.toLowerCase()) {
            case 'pdf':
                return <FileText className="w-8 h-8 text-red-500" />;
            case 'doc':
            case 'docx':
                return <FileText className="w-8 h-8 text-blue-500" />;
            case 'txt':
                return <FileText className="w-8 h-8 text-gray-500" />;
            case 'md':
                return <FileText className="w-8 h-8 text-purple-500" />;
            default:
                return <File className="w-8 h-8 text-gray-500" />;
        }
    };

    return (
        <div className="relative flex justify-center">
            <div className="relative p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                {getFileIcon()}
                <span className="text-sm text-gray-700">{fileName}</span>
                <button
                    onClick={onRemove}
                    className="ml-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    aria-label="Remove document"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                )}
            </div>
        </div>
    );
}