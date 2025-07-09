import React from 'react';

interface QuestionPanelProps {
  currentQuestion: number;
  questions: string[];
  onNextQuestion: () => void;
  onPreviousQuestion?: () => void;
  isInterviewActive: boolean;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  currentQuestion,
  questions,
  onNextQuestion,
  onPreviousQuestion,
  isInterviewActive,
}) => {
  if (!isInterviewActive) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Current Question</h3>
        <div className="text-sm text-gray-500">
          {currentQuestion + 1} of {questions.length}
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{questions[currentQuestion]}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentQuestion ? 'bg-blue-500' : 
                index < currentQuestion ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <div className="flex gap-2">
          {onPreviousQuestion && currentQuestion > 0 && (
            <button
              onClick={onPreviousQuestion}
              className="text-sm text-gray-600 hover:text-gray-700 font-medium"
            >
              ← Previous
            </button>
          )}
          
          {currentQuestion < questions.length - 1 && (
            <button
              onClick={onNextQuestion}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};