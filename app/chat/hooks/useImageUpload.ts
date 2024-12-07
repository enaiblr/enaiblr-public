import { useState } from 'react';
import imageCompression from 'browser-image-compression';

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
            // Compression options
            const options = {
                maxSizeMB: 1,             
                maxWidthOrHeight: 1920,    
                useWebWorker: true,        
                fileType: 'image/webp', 
                initialQuality: 0.8,       // Start with 80% quality   
                alwaysKeepResolution: true // Maintain resolution unless maxWidthOrHeight is exceeded
            }

            // Compress the image
            let compressedFile = await imageCompression(file, options);

            // If still too large, compress again with lower quality
            if (compressedFile.size > 1024 * 1024) {  // if > 1MB
                options.initialQuality = 0.6;  // Reduce quality to 60%
                compressedFile = await imageCompression(compressedFile, options);
            }

            const formData = new FormData();
            formData.append('file', compressedFile);
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