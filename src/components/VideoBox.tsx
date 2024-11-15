import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Mic, MicOff, VideoOff, User } from "lucide-react";
import "../index.css";

interface VideoBoxProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isUser?: boolean;
  isCameraOn?: boolean;
  isMicOn?: boolean;
  onToggleCamera?: () => void;
  onToggleMic?: () => void;
  title: string;
  className?: string;
}

export const VideoBox = ({
  videoRef,
  isUser,
  isCameraOn = true,
  isMicOn = true,
  onToggleCamera,
  onToggleMic,
  title,
  className = ""
}: VideoBoxProps) => {
  // Effect to handle media track enabling/disabling
  useEffect(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = isCameraOn;
      });
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMicOn;
      });
    }
  }, [isCameraOn, isMicOn, videoRef]);

  return (
    <div className={`relative h-full rounded-lg overflow-hidden bg-gray-900 ${className}`}>
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        muted={isUser}
        playsInline
        className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
      />

      {/* Camera off placeholder */}
      {!isCameraOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
          <User className="w-20 h-20 text-gray-400 mb-2" />
          <span className="text-gray-400 text-sm">Camera Off</span>
        </div>
      )}

      {/* Title badge */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {title}
      </div>

      {/* Controls for user video */}
      {isUser && (
        <div className="absolute bottom-4 left-4 flex gap-2">
          <Button
            variant={isCameraOn ? "secondary" : "destructive"}
            size="sm"
            onClick={onToggleCamera}
            className="h-8 w-8 p-0"
          >
            {isCameraOn ? <Camera size={14} /> : <VideoOff size={14} />}
          </Button>
          <Button
            variant={isMicOn ? "secondary" : "destructive"}
            size="sm"
            onClick={onToggleMic}
            className="h-8 w-8 p-0"
          >
            {isMicOn ? <Mic size={14} /> : <MicOff size={14} />}
          </Button>
        </div>
      )}

      {/* Status indicators */}
      <div className="absolute top-4 right-4 flex gap-2">
        {!isCameraOn && (
          <div className="bg-red-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <VideoOff size={12} />
            <span>Off</span>
          </div>
        )}
        {!isMicOn && (
          <div className="bg-red-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <MicOff size={12} />
            <span>Off</span>
          </div>
        )}
      </div>
    </div>
  );
};

