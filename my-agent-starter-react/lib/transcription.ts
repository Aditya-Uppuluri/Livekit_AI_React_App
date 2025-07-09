// Speech recognition utilities and types

export interface SpeechRecognitionConfig {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  timestamp: Date;
}

export class SpeechRecognitionManager {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean;
  private onResultCallback?: (result: SpeechRecognitionResult) => void;
  private onErrorCallback?: (error: string) => void;
  private onStartCallback?: () => void;
  private onEndCallback?: () => void;

  constructor() {
    this.isSupported = this.checkSupport();
  }

  private checkSupport(): boolean {
    return !!(
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition
    );
  }

  public isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  public initialize(config: SpeechRecognitionConfig = {}): boolean {
    if (!this.isSupported) {
      console.warn('Speech recognition is not supported in this browser');
      return false;
    }

    const SpeechRecognition = 
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? true;
    this.recognition.lang = config.lang ?? 'en-US';
    this.recognition.maxAlternatives = config.maxAlternatives ?? 1;

    // Set up event listeners
    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.onStartCallback?.();
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      this.onEndCallback?.();
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.onErrorCallback?.(event.error);
    };

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        const speechResult: SpeechRecognitionResult = {
          transcript,
          confidence,
          isFinal: result.isFinal,
          timestamp: new Date(),
        };

        this.onResultCallback?.(speechResult);
      }
    };

    return true;
  }

  public start(): boolean {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  public stop(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  public abort(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
  }

  public onResult(callback: (result: SpeechRecognitionResult) => void): void {
    this.onResultCallback = callback;
  }

  public onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  public onStart(callback: () => void): void {
    this.onStartCallback = callback;
  }

  public onEnd(callback: () => void): void {
    this.onEndCallback = callback;
  }

  public destroy(): void {
    this.stop();
    this.recognition = null;
    this.onResultCallback = undefined;
    this.onErrorCallback = undefined;
    this.onStartCallback = undefined;
    this.onEndCallback = undefined;
  }
}

// Utility functions for transcript processing
export const formatTranscript = (text: string): string => {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
};

export const exportTranscript = (transcript: Array<{
  timestamp: string;
  speaker: string;
  text: string;
}>): string => {
  return transcript
    .map(entry => `[${entry.timestamp}] ${entry.speaker}: ${entry.text}`)
    .join('\n');
};

export const getTimestamp = (date: Date = new Date()): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Audio level detection utilities
export const getAudioLevel = async (stream: MediaStream): Promise<number> => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  microphone.connect(analyser);
  
  return new Promise((resolve) => {
    const checkLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      resolve(average);
    };
    
    setTimeout(checkLevel, 100);
  });
};

// Browser compatibility check
export const getBrowserInfo = (): {
  name: string;
  version: string;
  speechSupport: boolean;
  audioSupport: boolean;
} => {
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';

  // Detect browser name and version
  if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
    name = 'Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    version = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Edge')) {
    name = 'Edge';
    const match = userAgent.match(/Edge\/([0-9.]+)/);
    version = match ? match[1] : 'Unknown';
  }

  return {
    name,
    version,
    speechSupport: !!(
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition
    ),
    audioSupport: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  };
};

// Text processing utilities
export const cleanTranscript = (text: string): string => {
  return text
    .replace(/\buh\b/gi, '')
    .replace(/\bum\b/gi, '')
    .replace(/\ber\b/gi, '')
    .replace(/\bah\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const splitIntoSentences = (text: string): string[] => {
  return text
    .split(/[.!?]+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);
};

export const highlightKeywords = (text: string, keywords: string[]): string => {
  let highlighted = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    highlighted = highlighted.replace(regex, `<mark>$&</mark>`);
  });
  return highlighted;
};

// Speech synthesis utilities
export const speakText = (text: string, options: {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
} = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    if (options.voice) {
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name === options.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

    speechSynthesis.speak(utterance);
  });
};

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  return speechSynthesis.getVoices();
};

// Transcript analysis utilities
export const analyzeTranscript = (transcript: string): {
  wordCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  speakingRate: number; // words per minute
  fillerWords: number;
  duration: number; // in minutes
} => {
  const words = transcript.split(/\s+/).filter(word => word.length > 0);
  const sentences = splitIntoSentences(transcript);
  
  const fillerWordPatterns = /\b(um|uh|er|ah|like|you know|actually|basically)\b/gi;
  const fillerMatches = transcript.match(fillerWordPatterns) || [];
  
  // Estimate duration based on average speaking rate (150 words per minute)
  const estimatedDuration = words.length / 150;
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    averageWordsPerSentence: sentences.length > 0 ? words.length / sentences.length : 0,
    speakingRate: estimatedDuration > 0 ? words.length / estimatedDuration : 0,
    fillerWords: fillerMatches.length,
    duration: estimatedDuration
  };
};

// Media stream utilities
export const getMediaStreamConstraints = (options: {
  audio?: boolean;
  video?: boolean;
  audioQuality?: 'low' | 'medium' | 'high';
  videoQuality?: 'low' | 'medium' | 'high';
}): MediaStreamConstraints => {
  const constraints: MediaStreamConstraints = {};

  if (options.audio) {
    const audioConstraints: MediaTrackConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    };

    switch (options.audioQuality) {
      case 'low':
        audioConstraints.sampleRate = 8000;
        audioConstraints.channelCount = 1;
        break;
      case 'medium':
        audioConstraints.sampleRate = 16000;
        audioConstraints.channelCount = 1;
        break;
      case 'high':
        audioConstraints.sampleRate = 44100;
        audioConstraints.channelCount = 2;
        break;
    }

    constraints.audio = audioConstraints;
  }

  if (options.video) {
    const videoConstraints: MediaTrackConstraints = {};

    switch (options.videoQuality) {
      case 'low':
        videoConstraints.width = 320;
        videoConstraints.height = 240;
        videoConstraints.frameRate = 15;
        break;
      case 'medium':
        videoConstraints.width = 640;
        videoConstraints.height = 480;
        videoConstraints.frameRate = 30;
        break;
      case 'high':
        videoConstraints.width = 1280;
        videoConstraints.height = 720;
        videoConstraints.frameRate = 60;
        break;
    }

    constraints.video = videoConstraints;
  }

  return constraints;
};

// Error handling utilities
export const handleSpeechRecognitionError = (error: string): string => {
  switch (error) {
    case 'no-speech':
      return 'No speech was detected. Please try speaking again.';
    case 'aborted':
      return 'Speech recognition was aborted.';
    case 'audio-capture':
      return 'Audio capture failed. Please check your microphone.';
    case 'network':
      return 'Network error occurred. Please check your internet connection.';
    case 'not-allowed':
      return 'Microphone access was denied. Please allow microphone access.';
    case 'service-not-allowed':
      return 'Speech recognition service is not allowed.';
    case 'bad-grammar':
      return 'Grammar error in speech recognition.';
    case 'language-not-supported':
      return 'The selected language is not supported.';
    default:
      return `Speech recognition error: ${error}`;
  }
};

// Performance monitoring
export const performanceMonitor = {
  startTime: 0,
  endTime: 0,
  
  start(): void {
    this.startTime = performance.now();
  },
  
  end(): number {
    this.endTime = performance.now();
    return this.endTime - this.startTime;
  },
  
  measure(label: string): number {
    const duration = this.end();
    console.log(`${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }
};

// Type declarations for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    mozSpeechRecognition: typeof SpeechRecognition;
    msSpeechRecognition: typeof SpeechRecognition;
  }
}

export interface TranscriptEntry {
  id: string;
  timestamp: string;
  speaker: string;
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface TranscriptSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  entries: TranscriptEntry[];
  metadata: {
    language: string;
    totalWords: number;
    duration: number;
  };
}