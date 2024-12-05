interface ImagePreviewProps {
    localImageUrl: string | null;
    tempImageUrl: string | null;
    isUploading: boolean;
    onRemove: () => void;
}

export function ImagePreview({ localImageUrl, tempImageUrl, isUploading, onRemove }: ImagePreviewProps) {
    return (
        <div className="mb-0 flex justify-center">
            <div className="relative bg-white p-2 rounded-lg shadow-md inline-block">
                <div className="relative">
                    <img
                        src={localImageUrl || tempImageUrl || undefined}
                        alt="Preview"
                        className={`h-20 w-20 object-cover rounded-lg transition-opacity duration-200 ${isUploading ? 'opacity-50' : 'opacity-100'}`}
                    />
                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                    style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    ×
                </button>
            </div>
        </div>
    );
}