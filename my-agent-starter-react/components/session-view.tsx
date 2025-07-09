import React, { useState, useEffect } from 'react';
import { useLocalParticipant } from '@livekit/components-react';
import { InterviewHeader } from './interview-header';
import { VideoPanel } from './video-panel';
import { AIAssistantPanel } from './ai-assistant-panel';
import { QuestionPanel } from './question-panel';
import { TranscriptPanel } from './transcript-panel';
import { NotesPanel } from './notes-panel';
import { CompletionScreen } from './completion-screen';
import { useInterviewState } from '../hooks/useInterviewState';
import { useTranscription } from '../hooks/useTranscription';

interface SessionViewProps {
  capabilities: {
    supportsChatInput: boolean;
    supportsVideoInput: boolean;
    supportsScreenShare: boolean;
  };
  sessionStarted: boolean;
  disabled: boolean;
}

export const SessionView: React.FC<SessionViewProps> = ({
  capabilities,
  sessionStarted,
  disabled,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

  const { localParticipant } = useLocalParticipant();
  
  const {
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
  } = useInterviewState();

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    addAIResponse,
    clearTranscript,
  } = useTranscription();

  const handleStartInterview = () => {
    startInterview();
    startListening();
    clearTranscript();
    // Add initial AI greeting to transcript
    addAIResponse("Welcome! I'm your AI interviewer. Let's begin with the first question.");
  };

  const handleEndInterview = () => {
    endInterview();
    stopListening();
    addAIResponse("Thank you for completing the interview. Your responses have been recorded.");
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  const handleReturnHome = () => {
    resetInterview();
    clearTranscript();
  };

  const handleNextQuestion = () => {
    nextQuestion();
    // Add AI response for new question
    if (currentQuestion + 1 < questions.length) {
      setTimeout(() => {
        addAIResponse(`Great! Now let's move to the next question: ${questions[currentQuestion + 1]}`);
      }, 500);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts if interview is active and not in an input field
      if (interviewStatus !== 'active' || 
          event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'm':
        case 'M':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleToggleMute();
          }
          break;
        case 'v':
        case 'V':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleToggleVideo();
          }
          break;
        case 't':
        case 'T':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleToggleTranscript();
          }
          break;
        case 'ArrowRight':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleNextQuestion();
          }
          break;
        case 'ArrowLeft':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            previousQuestion();
          }
          break;
        case 'Escape':
          event.preventDefault();
          handleEndInterview();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [interviewStatus, handleToggleMute, handleToggleVideo, handleToggleTranscript, handleNextQuestion, previousQuestion, handleEndInterview]);

  if (!sessionStarted || disabled) {
    return null;
  }

  if (interviewStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
        <div className="flex h-full flex-col">
          <InterviewHeader showCompletionNav={true} />
          <CompletionScreen
            timeElapsed={timeElapsed}
            totalQuestions={questions.length}
            formatTime={formatTime}
            onReturnHome={handleReturnHome}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans">
      <div className="flex h-full flex-col">
        <InterviewHeader />
        
        {/* Main Content */}
        <div className="flex-1 flex gap-6 p-6">
          {/* Left Panel - Video & Controls */}
          <VideoPanel
            isInterviewActive={interviewStatus === 'active'}
            isRecording={isRecording}
            timeElapsed={timeElapsed}
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            showTranscript={showTranscript}
            onStartInterview={handleStartInterview}
            onEndInterview={handleEndInterview}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            onToggleTranscript={handleToggleTranscript}
            formatTime={formatTime}
          />

          {/* Right Panel - AI Assistant & Controls */}
          <div className="w-96 space-y-6">
            <AIAssistantPanel
              aiResponse={aiResponse}
              isInterviewActive={interviewStatus === 'active'}
              isListening={isListening}
            />

            <QuestionPanel
              currentQuestion={currentQuestion}
              questions={questions}
              onNextQuestion={handleNextQuestion}
              onPreviousQuestion={previousQuestion}
              isInterviewActive={interviewStatus === 'active'}
            />

            <NotesPanel
              notes={notes}
              onNotesChange={setNotes}
              isInterviewActive={interviewStatus === 'active'}
            />

            <TranscriptPanel
              transcript={transcript}
              showTranscript={showTranscript}
            />

            {/* Keyboard Shortcuts Helper */}
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Keyboard Shortcuts</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Ctrl/Cmd + M: Toggle Mute</div>
                <div>Ctrl/Cmd + V: Toggle Video</div>
                <div>Ctrl/Cmd + T: Toggle Transcript</div>
                <div>Ctrl/Cmd + →: Next Question</div>
                <div>Escape: End Interview</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};