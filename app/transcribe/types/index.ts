export interface TranscriptionResult {
    fileName: string;
    audioDuration: string;
    textLength: number;
    transcriptionDate: Date;
    segments: TranscriptionSegment[];
  }
  
  export interface TranscriptionSegment {
    startTime: number;
    endTime: number;
    text: string;
  }
  
  export interface Language {
    code: string;
    name: string;
  }