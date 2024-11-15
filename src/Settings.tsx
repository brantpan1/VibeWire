// src/App.tsx
import React, { useState, useEffect, useRef } from "react";
import { VideoBox } from "./components/VideoBox";
import { ChatBox } from "./components/ChatBox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "./index.css";
// import { Link } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "stranger";
  timestamp: Date;
}

// interface ChatPartner {
//   id: string;
//   name: string;
// }

const Settings = () => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const userVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        setPermissionsGranted(true);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setPermissionsGranted(false);
      }
    };
    setupMedia();

    return () => {
      if (userVideoRef.current?.srcObject) {
        const stream = userVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="mx-auto container">
        <a href="/Home">Home Page</a>
        <span className="mx-4"></span>
        <a href="/App">Chat</a>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="grid grid-cols-2 gap-6 h-[80vh] border border-gray-700 rounded-lg overflow-hidden bg-black/30">
          {/* Left side - Videos */}
          <div className="relative h-full border-r border-gray-700">
            <div className="absolute top-0 left-0 w-full h-1/2 p-4 border-b border-gray-700">
              <VideoBox
                videoRef={userVideoRef}
                isUser={true}
                isCameraOn={isCameraOn}
                isMicOn={isMicOn}
                onToggleCamera={() => setIsCameraOn(!isCameraOn)}
                onToggleMic={() => setIsMicOn(!isMicOn)}
                title="You"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 p-4">
              <h3>Camera</h3> <br />
              <select name="camera" id="camera-options">
                <option value="cam1">Camera1</option>
                <option value="cam2">Camera2</option>
              </select>
            </div>
          </div>

          {/* Right side - Microphone,Sensitivity & Audio */}
          <h3>Microphone</h3> <br />
          <select name="microphone" id="microphone-options">
            <option value="mic1">Microphone1</option>
            <option value="mic2">Microphone2</option>
          </select>{" "}
          <br />
          <h3>Sensitivity</h3> <br />
          <div className="slidecontainer">
            <input
              type="range"
              min="1"
              max="100"
              value="50"
              className="slider"
              id="myRange"
            />
          </div>
          <h3>Audio</h3> <br />
          <select name="audio" id="audio-options">
            <option value="audio1">Audio1</option>
            <option value="audio2">Audio2</option>
          </select>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Settings;
