import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CompletionScreenProps {
  timeElapsed: number;
  totalQuestions: number;
  formatTime: (seconds: number) => string;
  onReturnHome: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  timeElapsed,
  totalQuestions,
  formatTime,
  onReturnHome,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">Interview Completed</h2>
          
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Thank you for completing the interview. We appreciate your time and effort. 
            Your responses have been recorded and will be reviewed by our team. 
            We will reach out to you soon with the next steps.
          </p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onReturnHome}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Return to Home
          </button>
          
          <button
            className="px-8 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};