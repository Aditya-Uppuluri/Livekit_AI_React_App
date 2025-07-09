import { useState, useEffect, useRef, useCallback } from 'react';
import { TranscriptEntry } from '@/lib/types';

interface UseTranscriptionReturn {
  transcript: TranscriptEntry[];
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  addAIResponse: (text: string) => void;
  clearTranscript: () => void;
}

export const useTranscription = (): UseTranscriptionReturn => {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const interimTranscriptRef = useRef('');

  const formatTimestamp = (date: Date): string => {
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const addTranscriptEntry = useCallback((speaker: 'AI' | 'Candidate', text: string) => {
    const timestamp = formatTimestamp(new Date());
    setTranscript(prev => [...prev, { timestamp, speaker, text }]);
  }, []);

  const addAIResponse = useCallback((text: string) => {
    addTranscriptEntry('AI', text);
  }, [addTranscriptEntry]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      addTranscriptEntry('AI', 'Note: Speech recognition is not supported in this browser. Please type your responses or use a supported browser like Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Speech recognition started');
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Speech recognition ended');
      // Auto-restart if still supposed to be listening
      if (isListening) {
        setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error('Failed to restart speech recognition:', error);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Handle specific error cases
      if (event.error === 'not-allowed') {
        addTranscriptEntry('AI', 'Microphone access denied. Please enable microphone permissions and refresh the page.');
      } else if (event.error === 'no-speech') {
        // Don't show error for no-speech, just restart
        setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error('Failed to restart after no-speech:', error);
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        addTranscriptEntry('Candidate', finalTranscript);
        interimTranscriptRef.current = '';
      } else {
        interimTranscriptRef.current = interimTranscript;
      }
    };

    recognition.start();
  }, [addTranscriptEntry]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    interimTranscriptRef.current = '';
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    addAIResponse,
    clearTranscript,
  };
};

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}