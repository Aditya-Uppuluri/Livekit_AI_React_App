import { useState, useEffect, useRef, useCallback } from 'react';

export type InterviewStatus = 'waiting' | 'active' | 'completed';

interface InterviewState {
  currentQuestion: number;
  timeElapsed: number;
  interviewStatus: InterviewStatus;
  notes: string;
  aiResponse: string;
  isRecording: boolean;
}

interface UseInterviewStateReturn extends InterviewState {
  questions: string[];
  startInterview: () => void;
  endInterview: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setNotes: (notes: string) => void;
  setAiResponse: (response: string) => void;
  formatTime: (seconds: number) => string;
  resetInterview: () => void;
}

const DEFAULT_QUESTIONS = [
  "Tell me about yourself and your background.",
  "What interests you most about this role?",
  "Describe a challenging project you've worked on recently.",
  "Tell me about a time you had to work under pressure. How did you handle it?",
  "Where do you see yourself in five years?",
  "Do you have any questions for us?"
];

export const useInterviewState = (customQuestions?: string[]): UseInterviewStateReturn => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [interviewStatus, setInterviewStatus] = useState<InterviewStatus>('waiting');
  const [notes, setNotes] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questions = customQuestions || DEFAULT_QUESTIONS;

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const startInterview = useCallback(() => {
    setInterviewStatus('active');
    setIsRecording(true);
    setTimeElapsed(0);
    setCurrentQuestion(0);
    setAiResponse("Welcome! I'm your AI interviewer. Let's begin with a few questions to understand your background and experience. Please take your time and answer thoughtfully.");
    
    // Start the timer immediately when interview starts
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  }, []);

  const endInterview = useCallback(() => {
    setInterviewStatus('completed');
    setIsRecording(false);
    setAiResponse("Thank you for completing the interview. We appreciate your time and effort. Your responses have been recorded and will be reviewed by our team.");
    
    // Clear the timer when interview ends
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion, questions.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const resetInterview = useCallback(() => {
    setCurrentQuestion(0);
    setTimeElapsed(0);
    setInterviewStatus('waiting');
    setNotes('');
    setAiResponse('');
    setIsRecording(false);
  }, []);

  // Timer effect
  useEffect(() => {
    if (interviewStatus === 'active' && isRecording) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interviewStatus, isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    currentQuestion,
    timeElapsed,
    interviewStatus,
    notes,
    aiResponse,
    isRecording,
    questions,
    startInterview,
    endInterview,
    nextQuestion,
    previousQuestion,
    setNotes,
    setAiResponse,
    formatTime,
    resetInterview,
  };
};