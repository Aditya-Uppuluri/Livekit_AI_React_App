import React from 'react';
import { Play, Users, Video, Mic, MessageCircle } from 'lucide-react';

interface WelcomeProps {
  startButtonText: string;
  onStartCall: () => void;
  disabled: boolean;
}

export const Welcome: React.FC<WelcomeProps> = ({
  startButtonText,
  onStartCall,
  disabled,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">InterviewAI</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Interviews</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Candidates</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Templates</a>
            </nav>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
          </div>
        </header>

        {/* Welcome Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-4xl w-full text-center space-y-12">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Welcome to Your AI Interview
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Get ready for an interactive interview experience with our AI interviewer. 
                We'll ask you thoughtful questions and provide real-time feedback.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Interview</h3>
                <p className="text-gray-600 text-sm">
                  Face-to-face interaction with our AI interviewer using your camera and microphone.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Speech Recognition</h3>
                <p className="text-gray-600 text-sm">
                  Real-time transcription of your responses with automatic speech-to-text.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Transcript</h3>
                <p className="text-gray-600 text-sm">
                  Follow along with a live transcript of the conversation for reference.
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Before We Begin</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Technical Requirements:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Ensure your camera and microphone are working</li>
                    <li>• Use a stable internet connection</li>
                    <li>• Find a quiet, well-lit environment</li>
                    <li>• Close unnecessary applications</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Interview Tips:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Speak clearly and at a moderate pace</li>
                    <li>• Look at the camera when speaking</li>
                    <li>• Take your time to think before answering</li>
                    <li>• Be authentic and honest in your responses</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={onStartCall}
              disabled={disabled}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center gap-3">
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {startButtonText}
              </div>
            </button>

            <p className="text-sm text-gray-500">
              By starting the interview, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};