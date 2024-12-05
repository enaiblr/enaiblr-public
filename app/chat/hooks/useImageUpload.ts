import { useState } from 'react';

export function useImageUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
    const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

    const handleImageChange = (file: File | null) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setLocalImageUrl(url);
            handleImageUpload(file);
        }
    };

    const handleImageUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setTempImageUrl(data.url);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const clearImages = () => {
        if (localImageUrl) {
            URL.revokeObjectURL(localImageUrl);
        }
        setLocalImageUrl(null);
        setTempImageUrl(null);
    };

    return {
        isUploading,
        localImageUrl,
        tempImageUrl,
        handleImageChange,
        clearImages
    };
}