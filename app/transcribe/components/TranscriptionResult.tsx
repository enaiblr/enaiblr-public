import React, { useState } from 'react';
import { Download, Clock, FileText, Calendar, RefreshCw } from 'lucide-react';
import { Tabs } from './ui/Tabs';
import type { TranscriptionResult } from '../types';

interface TranscriptionResultProps {
  result: TranscriptionResult;
}

export function TranscriptionResult({ result }: TranscriptionResultProps) {
  const [activeTab, setActiveTab] = useState('timestamps');

  const handleDownload = () => {
    const text = result.segments.map(s => s.text).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName}-transcription.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-sm border-b z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-center relative">
          <button 
            onClick={() => window.location.reload()}
            className="absolute right-4 text-gray-600 hover:text-blue-600 transition-colors"
            title="New Transcription"
          >
            <RefreshCw size={20} />
          </button>
          <h1 className="text-xl font-bold">Transcription <span className='text-blue-600'>Result</span></h1>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {result.fileName.replace(/(\.[^.]+)$/, '')}
            <span className="text-blue-600">
              {result.fileName.match(/\.[^.]+$/)?.[0]}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-gray-600 justify-center">
              <Clock className="h-5 w-5 mr-2" />
              Duration:<span>{result.audioDuration}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 justify-center">
              <FileText className="h-5 w-5 mr-2" />
              <span>{result.textLength} Characters</span>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={[
            { value: 'timestamps', label: 'With Timestamps' },
            { value: 'text', label: 'Text Only' }
          ]}
        />

        <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
          {activeTab === 'timestamps' ? (
            <div className="space-y-4">
              {result.segments.map((segment, index) => (
                <div key={index} className="flex space-x-4">
                  <span className="text-gray-500 whitespace-nowrap">
                    [{formatTime(segment.startTime)} - {formatTime(segment.endTime)}]
                  </span>
                  <p>{segment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="prose max-w-none">
              {result.segments.map((segment, index) => (
                <p key={index}>{segment.text}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}