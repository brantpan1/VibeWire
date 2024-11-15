// src/App.tsx
import React, { useState, useEffect, useRef } from "react";
import { VideoBox } from "./components/VideoBox";
import { ChatBox } from "./components/ChatBox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "./index.css";
import { Button } from "@/components/ui/button";

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
          audio: true
        });

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        setPermissionsGranted(true);

        // Set initial track states
        stream.getVideoTracks().forEach(track => {
          track.enabled = isCameraOn;
        });
        stream.getAudioTracks().forEach(track => {
          track.enabled = isMicOn;
        });
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setPermissionsGranted(false);
      }
    };
    setupMedia();

    return () => {
      if (userVideoRef.current?.srcObject) {
        const stream = userVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Only run on mount

  const toggleCamera = () => {
    if (userVideoRef.current?.srcObject) {
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (userVideoRef.current?.srcObject) {
      setIsMicOn(!isMicOn);
    }
  };

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
    <div className="w-screen h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="mx-auto container max-w-[1600px] h-full flex flex-col">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white">Video Chat Roulette</h1>
        </div>

        {!permissionsGranted && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Please allow camera and microphone access to use video chat.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 grid grid-cols-2  min-h-[85vh] border-2 border-gray-600 rounded-xl overflow-hidden bg-gray-900/95 shadow-2xl">
          {/* Left side - Videos */}
          <div className="relative h-full border-r-2 border-gray-600">
            <div className="absolute top-0 left-0 w-full h-1/2 p-4 border-b-2 border-gray-600">
              <VideoBox
                videoRef={userVideoRef}
                isUser={true}
                isCameraOn={isCameraOn}
                isMicOn={isMicOn}
                onToggleCamera={toggleCamera}
                onToggleMic={toggleMic}
                title="You"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 p-4">
              <VideoBox
                videoRef={strangerVideoRef}
                title={isConnected ? "Stranger" : "Waiting for connection..."}
              />
            </div>
          </div>

          {/* Right side - Chat */}
          <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-800/50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[70%] ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isSearching && (
                  <div className="text-center text-gray-400 italic">
                    Looking for someone to chat with...
                  </div>
                )}
              </div>
            </div>

            {/* Input and Controls Area */}
            <div className="border-t-2 border-gray-600 bg-gray-800/80">
              {/* Message Input */}
              <div className="p-4">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    disabled={!isConnected || isSearching}
                    placeholder={
                      isSearching
                        ? "Finding someone to chat with..."
                        : isConnected
                        ? "Type a message..."
                        : "Click 'Next Chat' to start"
                    }
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Button
                    type="submit"
                    disabled={!isConnected || isSearching}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    Send
                  </Button>
                </form>
              </div>

              {/* Control Buttons */}
              <div className="px-4 pb-4 flex justify-end gap-3">
                <Button
                  onClick={handleStartChat}
                  disabled={isSearching || isConnected}
                  className="bg-blue-600 hover:bg-blue-700 min-w-[120px] disabled:opacity-50"
                >
                  {isSearching ? "Searching..." : "Next Chat"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsConnected(false)}
                  disabled={!isConnected}
                  className="min-w-[120px] disabled:opacity-50"
                >
                  End Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
