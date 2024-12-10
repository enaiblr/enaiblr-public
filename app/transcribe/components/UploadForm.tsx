import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, Check, AlertCircle } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Progress } from './ui/Progress';

interface UploadFormProps {
  onTranscriptionComplete: (result: any) => void;
}

export function UploadForm({ onTranscriptionComplete }: UploadFormProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    setErrorDetails(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.file.size > 40 * 1024 * 1024) {
        setError('File size exceeds 40MB limit');
        return;
      }
      setError('Invalid file format');
      setErrorDetails('Allowed formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm');
      return;
    }

    if (acceptedFiles[0].size > 40 * 1024 * 1024) {
      setError('File size exceeds 40MB limit');
      return;
    }

    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.flac', '.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.ogg', '.wav', '.webm']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate transcription process
    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);

      // Mock transcription result
      onTranscriptionComplete({
        fileName: file.name,
        audioDuration: "5:30",
        textLength: 850,
        transcriptionDate: new Date(),
        segments: [
          { startTime: 0, endTime: 3.5, text: "Hello, this is a sample transcription." },
          { startTime: 3.5, endTime: 7.2, text: "The actual transcription would contain real content." }
        ]
      });
    }, 6000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Audio <span className="text-blue-600">Transcription AI</span>
      </h1>
      {/* <p className="text-gray-600 text-sm mb-2 text-center">
        Upload your audio file and we'll convert it to text using advanced speech recognition
      </p> */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6">
          <LanguageSelector
            value={selectedLanguage}
            onChange={setSelectedLanguage}
          />
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${error ? 'border-red-500 bg-red-50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            {error ? (
              <>
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div className="space-y-1">
                  <p className="text-red-600 font-medium">{error}</p>
                  {errorDetails && (
                    <p className="text-sm text-red-500">
                      {errorDetails}
                    </p>
                  )}
                </div>
              </>
            ) : file ? (
              <>
                <Check className="h-12 w-12 text-green-500" />
                <span className="text-green-600 font-medium">{file.name}</span>
              </>
            ) : (
              <>
                <FileAudio className="h-12 w-12 text-gray-400" />
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium">
                    Drop your audio file here
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to select a file.
                  </p>
                  {/* <p className="text-xs text-gray-500">
                    Max size: 40MB. Formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm
                  </p> */}
                </div>
              </>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-sm text-center text-gray-600">
              {uploadProgress < 100
                ? `Uploading... ${uploadProgress}%`
                : 'Processing transcription...'}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isUploading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white
            ${!file || isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <Upload className="-ml-1 mr-2 h-5 w-5" />
              Processing...
            </span>
          ) : (
            'Start Transcription'
          )}
        </button>
      </form>
    </div>
  );
}