import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  Settings as SettingsIcon,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";

interface TutorialOverlayProps {
  onComplete: () => void;
  setActiveTab: (tab: "profile" | "settings" | null) => void;
  activeTab: "profile" | "settings" | null;
  isVisible: boolean;
}

const tutorialStyles = `
  @keyframes tutorialPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
  }

  .tutorial-highlight {
    animation: tutorialPulse 2s infinite;
    border: 2px solid #3b82f6;
    border-radius: 0.5rem;
  }
`;

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  onComplete,
  setActiveTab,
  activeTab,
  isVisible,
}) => {
  const [hasOpenedProfile, setHasOpenedProfile] = useState(false);
  const [hasOpenedSettings, setHasOpenedSettings] = useState(false);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = tutorialStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      setHasOpenedProfile(false);
      setHasOpenedSettings(false);

      const profileButton = document.querySelector('[data-tutorial="profile"]');
      const settingsButton = document.querySelector('[data-tutorial="settings"]');

      profileButton?.classList.add("tutorial-highlight");
      settingsButton?.classList.add("tutorial-highlight");

      return () => {
        profileButton?.classList.remove("tutorial-highlight");
        settingsButton?.classList.remove("tutorial-highlight");
      };
    }
  }, [isVisible]);

  useEffect(() => {
    if (activeTab === "profile") {
      setHasOpenedProfile(true);
      const profileButton = document.querySelector('[data-tutorial="profile"]');
      profileButton?.classList.remove("tutorial-highlight");
    }
    if (activeTab === "settings") {
      setHasOpenedSettings(true);
      const settingsButton = document.querySelector('[data-tutorial="settings"]');
      settingsButton?.classList.remove("tutorial-highlight");
    }
  }, [activeTab]);

  useEffect(() => {
    if (hasOpenedProfile && hasOpenedSettings) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  }, [hasOpenedProfile, hasOpenedSettings, onComplete]);

  const handleTaskClick = (taskId: string) => {
    if (taskId === 'profile' && !hasOpenedProfile) {
      setActiveTab('profile');
    } else if (taskId === 'settings' && !hasOpenedSettings) {
      setActiveTab('settings');
    }
  };

  const tasks = [
    {
      id: "profile",
      title: "Open Profile Settings",
      description: "Click the profile icon to view your profile settings",
      completed: hasOpenedProfile,
      icon: User,
    },
    {
      id: "settings",
      title: "Check Camera & Mic Settings",
      description: "Click the settings icon to manage your devices",
      completed: hasOpenedSettings,
      icon: SettingsIcon,
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0" style={{ pointerEvents: "none" }}>
      <div className="w-[100vw] h-[100vh] inset-0 bg-black/50 z-[9999]" />

      <div
        className="absolute bottom-20 left-4 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-600 w-[400px] opacity-0 translate-y-4 animate-fadeIn z-[10000]"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Welcome to VibeWire!</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={onComplete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-colors duration-200 ${
                task.completed ? "bg-gray-700/50" : "bg-gray-700 cursor-pointer hover:bg-gray-600"
              }`}
              onClick={() => !task.completed && handleTaskClick(task.id)}
              style={{ cursor: task.completed ? 'default' : 'pointer' }}
            >
              <div className="flex-shrink-0 mt-1">
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-medium mb-1 ${
                    task.completed ? "text-green-400" : "text-white"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-gray-400">{task.description}</p>
              </div>
              <task.icon
                className={`w-5 h-5 ${
                  !task.completed && task.id === (activeTab || "")
                    ? "text-blue-400 animate-pulse"
                    : "text-gray-400"
                }`}
              />
            </div>
          ))}
        </div>

        {hasOpenedProfile && hasOpenedSettings && (
          <div className="mt-6 text-center text-green-400 animate-fadeIn">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">
              All set! You're ready to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialOverlay;