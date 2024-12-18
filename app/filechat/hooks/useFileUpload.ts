import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
    try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    } catch (error) {
        console.error('Error setting up PDF.js worker:', error);
    }
}



interface FileInfo {
    fileName: string;
    fileType: string;
    content: string;
}

export function useFileUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const ALLOWED_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
        'text/x-markdown',
        'application/markdown',
        'application/x-markdown'
    ];

    const getFileExtension = (fileName: string): string => {
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        if (['doc', 'docx'].includes(ext)) return 'doc';
        if (['md', 'markdown'].includes(ext)) return 'md';
        return ext;
    };

    const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        try {
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let text = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map((item: any) => item.str).join(' ') + '\n';
            }

            return text;
        } catch (error) {
            console.error('Error extracting PDF text:', error);
            throw new Error('Failed to extract text from PDF');
        }
    };

    const extractTextFromDOCX = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        try {
            const result = await mammoth.extractRawText({
                arrayBuffer: arrayBuffer
            });
            return result.value;
        } catch (error) {
            console.error('Error extracting DOCX text:', error);
            throw new Error('Failed to extract text from DOCX');
        }
    };

    const handleFileChange = async (file: File | null) => {
        setError(null);

        if (!file) {
            setFileInfo(null);
            setFileContent(null);
            return;
        }

        // Check file extension and type
        const extension = getFileExtension(file.name);
        const isMarkdown = extension === 'md';
        const isPDF = extension === 'pdf';
        const isDoc = ['doc', 'docx'].includes(extension);

        // More permissive type checking
        const isAllowedType = ALLOWED_TYPES.includes(file.type) ||
            (isMarkdown && (file.type === 'text/plain' || file.type === '')) ||
            (isPDF && file.type === 'application/pdf') ||
            (isDoc && (file.type.includes('word') || file.type.includes('document')));

        if (!isAllowedType) {
            setError(`Unsupported file type: ${file.type} for extension: ${extension}`);
            console.error('Unsupported file type:', file.type, 'extension:', extension);
            return;
        }

        setIsUploading(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            let content = '';

            if (isPDF) {
                content = await extractTextFromPDF(arrayBuffer);
            } else if (isDoc) {
                content = await extractTextFromDOCX(arrayBuffer);
            } else {
                // For markdown and text files
                content = await file.text();
            }

            setFileInfo({
                fileName: file.name,
                fileType: extension,
                content
            });
            setFileContent(content);
        } catch (error) {
            console.error('Error processing file:', error);
            setError(error instanceof Error ? error.message : 'Failed to process file');
            setFileInfo(null);
            setFileContent(null);
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        setFileInfo(null);
        setFileContent(null);
        setError(null);
    };

    return {
        isUploading,
        fileInfo,
        fileContent,
        error,
        handleFileChange,
        clearFile
    };
}