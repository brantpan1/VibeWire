import React, { useState, useEffect, useRef } from "react";
import { VideoBox } from "./components/VideoBox";
import { ChatBox } from "./components/ChatBox";
import { ProfileSettings } from "./components/ProfileSettings";
import { Settings } from "./components/Settings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { User, Settings as SettingsIcon } from "lucide-react";
import { Login } from "./components/Login";
import TutorialOverlay from "./components/TutorialOverlay";
import TopicSelection from "./components/TopicSelection";
import "./index.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "stranger";
  timestamp: Date;
}

// Update this with your own video assets
const VIDEO_URLS = [
  "/public/Video1.mp4",
  "/public/Video2.mp4",
  "/public/Video3.mp4",
];

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTutorialVisible, setIsTutorialVisible] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "settings" | null>(
    null,
  );
  const [chatPhase, setChatPhase] = useState<"topic" | "chat">("topic");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const strangerVideoRef = useRef<HTMLVideoElement>(null);

  const handleTutorialComplete = () => {
    setIsTutorialVisible(false);
  };

  const showTutorial = () => {
    setIsTutorialVisible(true);
  };

  const handleLogin = () => {
    console.log("Redirecting to NUportal...");
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setIsTutorialVisible(true);
    }
  }, [isAuthenticated]);

  // Handle click outside for menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isSelectElement =
        target.closest('[role="combobox"]') ||
        target.closest('[role="listbox"]') ||
        target.closest(".select-content") ||
        target.closest("[cmdk-list-sizer]") ||
        target.closest(".settings-menu") ||
        target.closest(".settings-button");

      if (activeTab && !isSelectElement) {
        setActiveTab(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeTab]);

  // Media setup - now checking for chatPhase
  useEffect(() => {
    const setupMedia = async () => {
      if (chatPhase === "chat") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
          setPermissionsGranted(true);

          stream.getVideoTracks().forEach((track) => {
            track.enabled = isCameraOn;
          });
          stream.getAudioTracks().forEach((track) => {
            track.enabled = isMicOn;
          });
        } catch (err) {
          console.error("Error accessing media devices:", err);
          setPermissionsGranted(false);
        }
      }
    };

    setupMedia();

    return () => {
      if (userVideoRef.current?.srcObject) {
        const stream = userVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [chatPhase]);

  // Setup stranger video when connected
  useEffect(() => {
    if (isConnected && strangerVideoRef.current) {
      strangerVideoRef.current.src = VIDEO_URLS[currentVideoIndex];
      strangerVideoRef.current
        .play()
        .catch((err) => console.error("Error playing filler video:", err));
    }
  }, [isConnected, currentVideoIndex]);

  const toggleCamera = () => {
    if (userVideoRef.current?.srcObject) {
      const stream = userVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (userVideoRef.current?.srcObject) {
      const stream = userVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const handleStartChat = () => {
    if (currentTopic.trim() === "" && chatPhase === "topic") return;

    setIsSearching(true);
    setMessages([]);

    setTimeout(() => {
      setIsConnected(true);
      setIsSearching(false);
      setChatPhase("chat");
      handleNextVideo();
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setChatPhase("topic");
    setCurrentTopic("");
    setCurrentVideoIndex(0); // Reset the video index

    if (strangerVideoRef.current) {
      strangerVideoRef.current.pause();
      strangerVideoRef.current.src = "";
    }
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

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % VIDEO_URLS.length);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="mx-auto container max-w-[1920px] h-full flex flex-col">
        <div className="mb-4 flex justify-end relative z-50">
          <h1 className="text-3xl font-bold text-white absolute left-0">
            VibeWire
          </h1>

          {/* Menu Tabs */}
          <div className="flex gap-2 bg-gray-800/80 p-1 rounded-lg border border-gray-600 settings-menu mr-2">
            <Button
              variant="ghost"
              size="icon"
              data-tutorial="profile"
              className={`rounded-lg w-10 h-10 settings-button transition-colors duration-200 ${
                activeTab === "profile"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
              onClick={() =>
                setActiveTab(activeTab === "profile" ? null : "profile")
              }
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              data-tutorial="settings"
              className={`rounded-lg w-10 h-10 settings-button transition-colors duration-200 ${
                activeTab === "settings"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
              onClick={() =>
                setActiveTab(activeTab === "settings" ? null : "settings")
              }
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Profile Settings */}
          <div
            className={`settings-menu absolute right-0 top-full transition-all duration-300 transform origin-top-right z-[100]
              ${
                activeTab === "profile"
                  ? "opacity-100 scale-100 translate-y-2"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
          >
            <ProfileSettings
              isOpen={activeTab === "profile"}
              onClose={() => setActiveTab(null)}
            />
          </div>

          {/* Input/Output Settings */}
          <div
            className={`settings-menu absolute right-0 top-full transition-all duration-300 transform origin-top-right z-[100]
              ${
                activeTab === "settings"
                  ? "opacity-100 scale-100 translate-y-2"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
          >
            <Settings
              isOpen={activeTab === "settings"}
              onClose={() => setActiveTab(null)}
              isCameraEnabled={isCameraOn}
              isMicEnabled={isMicOn}
              onToggleCamera={toggleCamera}
              onToggleMic={toggleMic}
            />
          </div>
        </div>

        {!permissionsGranted && chatPhase === "chat" && (
          <Alert variant="destructive" className="mb-4 relative z-40">
            <AlertDescription>
              Please allow camera and microphone access to use video chat.
            </AlertDescription>
          </Alert>
        )}

        {/* Main container */}
        <div className="flex-1 grid grid-cols-2 min-h-[80vh] max-h-[80vh] border-2 border-gray-600 rounded-xl overflow-hidden bg-gray-900/95 shadow-2xl relative z-0">
          {chatPhase === "topic" ? (
            <div className="col-span-2">
              <TopicSelection
                onTopicSubmit={handleStartChat}
                currentTopic={currentTopic}
                setCurrentTopic={setCurrentTopic}
                isSearching={isSearching}
              />
            </div>
          ) : (
            <>
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
                    title={
                      isConnected ? "Stranger" : "Waiting for connection..."
                    }
                  />
                </div>
              </div>

              {/* Messages Area */}
              <ChatBox
                currentTopic={currentTopic}
                messages={messages}
                currentMessage={currentMessage}
                onMessageChange={setCurrentMessage}
                onSendMessage={handleSendMessage}
                isConnected={isConnected}
                isSearching={isSearching}
                onStartChat={handleStartChat}
                onDisconnect={handleDisconnect}
                onNextVideo={handleNextVideo}
              />
            </>
          )}
        </div>

        {/* Control Buttons */}
        <div className="mt-4 flex justify-end gap-3 relative z-0">
          <Button
            variant="destructive"
            onClick={handleDisconnect}
            disabled={!isConnected}
            className="min-w-[120px] disabled:opacity-50"
          >
            End Chat
          </Button>
          <Button
            onClick={handleStartChat}
            disabled={
              (!currentTopic.trim() && chatPhase === "topic") || isSearching
            }
            className="bg-blue-600 hover:bg-blue-700 min-w-[120px] disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Next Chat"}
          </Button>
        </div>

        <TutorialOverlay
          onComplete={handleTutorialComplete}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          isVisible={isTutorialVisible}
        />
      </div>
    </div>
  );
};

export default App;
