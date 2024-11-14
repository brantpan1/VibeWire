// src/App.tsx
import React, { useState, useEffect, useRef } from "react";
import { VideoBox } from "./components/VideoBox";
import { ChatBox } from "./components/ChatBox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "./index.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "stranger";
  timestamp: Date;
}

interface ChatPartner {
  id: string;
  name: string;
}

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const strangerVideoRef = useRef<HTMLVideoElement>(null);

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

  const handleStartChat = () => {
    setIsSearching(true);
    setMessages([]);

    setTimeout(() => {
      setIsConnected(true);
      setIsSearching(false);

      if (strangerVideoRef.current) {
        strangerVideoRef.current.poster = "/api/placeholder/640/480";
      }
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      text: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setCurrentMessage("");

    setTimeout(() => {
      const response: Message = {
        id: Math.random().toString(36).substring(7),
        text: "This is a simulated response from the stranger",
        sender: "stranger",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="mx-auto container">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Video Chat Roulette</h1>
        </div>

        {!permissionsGranted && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Please allow camera and microphone access to use video chat.
            </AlertDescription>
          </Alert>
        )}

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
              <VideoBox videoRef={strangerVideoRef} title="Stranger" />
            </div>
          </div>

          {/* Right side - Chat */}
          <ChatBox
            messages={messages}
            currentMessage={currentMessage}
            onMessageChange={setCurrentMessage}
            onSendMessage={handleSendMessage}
            isConnected={isConnected}
            isSearching={isSearching}
            onStartChat={handleStartChat}
            onDisconnect={() => setIsConnected(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
