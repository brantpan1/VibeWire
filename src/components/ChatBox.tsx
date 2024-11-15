// src/components/ChatBox.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import "../index.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "stranger";
  timestamp: Date;
}

interface ChatBoxProps {
  messages: Message[];
  currentMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isConnected: boolean;
  isSearching: boolean;
  onStartChat: () => void;
  onDisconnect: () => void;
}

export const ChatBox = ({
  messages,
  currentMessage,
  onMessageChange,
  onSendMessage,
  isConnected,
  isSearching,
}: ChatBoxProps) => (
  <div className="flex flex-col h-full">
    <div className="p-4 bg-gray-800/50 border-b border-gray-700">
      <h2 className="text-lg font-semibold text-white">Chat</h2>
    </div>

    <ScrollArea className="flex-1 p-4">
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
            Looking for someone you can talk to...
          </div>
        )}
      </div>
    </ScrollArea>

    <div className="p-4 bg-gray-800/50 border-t border-gray-700">
      <form onSubmit={onSendMessage} className="flex gap-2">
        <Input
          value={currentMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={
            isSearching
              ? "Finding someone to chat with..."
              : isConnected
              ? "Type a message..."
              : "Click 'Next Chat' to start"
          }
          disabled={!isConnected || isSearching}
          className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
        />
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!isConnected || isSearching}
        >
          Send
        </Button>
      </form>
    </div>
  </div>
);