import React, { useEffect, useRef } from 'react';
import { Play, Mic, MicOff, Video, VideoOff, MessageCircle, Clock, Users } from 'lucide-react';
import { useLocalParticipant, useRoomContext, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

interface VideoPanelProps {
  isInterviewActive: boolean;
  isRecording: boolean;
  timeElapsed: number;
  isMuted: boolean;
  isVideoOn: boolean;
  showTranscript: boolean;
  onStartInterview: () => void;
  onEndInterview: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleTranscript: () => void;
  formatTime: (seconds: number) => string;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({
  isInterviewActive,
  isRecording,
  timeElapsed,
  isMuted,
  isVideoOn,
  showTranscript,
  onStartInterview,
  onEndInterview,
  onToggleMute,
  onToggleVideo,
  onToggleTranscript,
  formatTime,
}) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Get local camera track
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true, participant: localParticipant },
  ]);

  const handleToggleMute = async () => {
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(!isMuted);
    }
    onToggleMute();
  };

  const handleToggleVideo = async () => {
    if (localParticipant) {
      await localParticipant.setCameraEnabled(!isVideoOn);
    }
    onToggleVideo();
  };

  // Attach video track to video element
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && tracks.length > 0) {
      const track = tracks[0];
      if (track.publication?.track) {
        track.publication.track.attach(videoElement);
        return () => {
          track.publication?.track?.detach(videoElement);
        };
      }
    }
  }, [tracks]);

  return (
    <div className="flex-1 max-w-4xl space-y-6">
      {/* Video Area */}
      <div className="relative bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="aspect-video flex items-center justify-center relative">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {!isInterviewActive ? (
            <button
              onClick={onStartInterview}
              className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
            >
              <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              {/* Video track rendered using ref */}
              {isVideoOn && tracks.length > 0 && tracks[0].publication?.track ? (
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Status Indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-white text-sm font-medium">
              {isRecording ? 'Recording' : 'Standby'}
            </span>
          </div>

          {/* Timer */}
          {isInterviewActive && (
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="flex items-center gap-1 text-white text-sm font-medium">
                <Clock className="w-4 h-4" />
                {formatTime(timeElapsed)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleMute}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isMuted 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleToggleVideo}
              className={`p-3 rounded-xl transition-all duration-200 ${
                !isVideoOn 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onToggleTranscript}
              className={`p-3 rounded-xl transition-all duration-200 ${
                showTranscript
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            <button
              onClick={onEndInterview}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              End Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};