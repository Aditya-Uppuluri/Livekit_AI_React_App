import React from 'react';
import { Users } from 'lucide-react';

interface AIAssistantPanelProps {
  aiResponse: string;
  isInterviewActive: boolean;
  isListening?: boolean;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  aiResponse,
  isInterviewActive,
  isListening = false,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">AI Interviewer</h3>
      </div>
      
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {aiResponse || "Welcome! I'm ready to begin your interview when you are."}
      </p>
      
      {isInterviewActive && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          {isListening ? 'Listening...' : 'Standby'}
        </div>
      )}
    </div>
  );
};