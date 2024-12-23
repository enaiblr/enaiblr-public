import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FlashCard, FlashCardContent } from '../types';

// Initialize PDF.js outside of component
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export const usePDFProcessor = () => {
  const [pdfLink, setPdfLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<FlashCardContent[]>([]);
  const [hashtag, setHashtag] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let text = '';
      // Get all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => (item.str || '').trim())
          .filter(str => str.length > 0)
          .join(' ');
        text += pageText + '\n';
      }

      if (!text.trim()) {
        throw new Error("No text content found in the PDF");
      }

      return text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleProcess = async () => {
    if (!pdfLink && !file) {
      setErrorMessage("Please provide a PDF link or file");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      let pdfText = '';
      
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        pdfText = await extractTextFromPDF(arrayBuffer);
      } else if (pdfLink && isValidUrl(pdfLink)) {
        try {
          const response = await fetch(pdfLink, {
            mode: 'cors',
            headers: {
              'Accept': 'application/pdf'
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
          }

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/pdf')) {
            throw new Error('The URL does not point to a valid PDF file');
          }

          const arrayBuffer = await response.arrayBuffer();
          pdfText = await extractTextFromPDF(arrayBuffer);
        } catch (error) {
          if (error instanceof Error) {
            // If CORS is the issue, try fetching through our API
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
              const apiResponse = await fetch('/api/proxy-pdf', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: pdfLink }),
              });

              if (!apiResponse.ok) {
                throw new Error('Failed to fetch PDF through proxy');
              }

              const arrayBuffer = await apiResponse.arrayBuffer();
              pdfText = await extractTextFromPDF(arrayBuffer);
            } else {
              throw error;
            }
          } else {
            throw new Error('Failed to fetch PDF');
          }
        }
      } else {
        throw new Error("Invalid PDF link");
      }

      const response = await fetch('/api/paper-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: pdfText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      
      // Ensure we have valid flashcards array
      const validFlashcards = Array.isArray(data.flashcards) 
        ? data.flashcards.filter((card: any) => typeof card === 'object' && card !== null)
        : [];
        
      if (validFlashcards.length === 0) {
        throw new Error('No valid flashcards were generated');
      }
      
      setCards(validFlashcards);
      setHashtag(Array.isArray(data.hashtags) ? data.hashtags : []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pdfLink,
    setPdfLink,
    file,
    setFile,
    isLoading,
    cards,
    setCards,
    hashtag,
    setHashtag,
    errorMessage,
    setErrorMessage,
    handleProcess
  };
};
