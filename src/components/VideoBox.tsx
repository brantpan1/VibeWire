import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, Mic, MicOff, VideoOff } from "lucide-react";
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
  className = "",
}: VideoBoxProps) => (
  <div
    className={`relative h-full rounded-lg overflow-hidden bg-gray-900 ${className}`}
  >
    <video
      ref={videoRef}
      autoPlay
      muted={isUser}
      playsInline
      className="w-full h-full object-cover"
    />
    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
      {title}
    </div>
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
  </div>
);
