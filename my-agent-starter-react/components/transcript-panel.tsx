import React, { useEffect, useRef } from 'react';
import { TranscriptEntry } from '@/lib/types';

interface TranscriptPanelProps {
  transcript: TranscriptEntry[];
  showTranscript: boolean;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  transcript,
  showTranscript,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new transcript entries are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  if (!showTranscript) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Transcript</h3>
        <div className="text-sm text-gray-500">
          {transcript.length} entries
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="max-h-48 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {transcript.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            Start the interview to see the transcript
          </div>
        ) : (
          transcript.map((entry, index) => (
            <div key={index} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-500 font-mono text-xs min-w-[48px]">
                  {entry.timestamp}
                </span>
                <span className={`font-semibold ${
                  entry.speaker === 'AI' ? 'text-blue-600' : 'text-purple-600'
                }`}>
                  {entry.speaker}:
                </span>
              </div>
              <p className="text-gray-700 ml-14 leading-relaxed">
                {entry.text}
              </p>
            </div>
          ))
        )}
      </div>
      
      {transcript.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Export Transcript
          </button>
        </div>
      )}
    </div>
  );
};