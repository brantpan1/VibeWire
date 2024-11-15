import React from "react";
import { Button } from "@/components/ui/button";

interface LoginProps {
  onLogin: () => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-md flex flex-col items-center gap-8 p-4">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-white animate-fade-in">
            Welcome to VibeWire!
          </h1>
          <p className="text-gray-400 text-lg">
            Connect with your fellow Huskies
          </p>
        </div>

        <Button
          onClick={onLogin}
          className="w-64 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg transition-all
            hover:scale-105 active:scale-95"
        >
          Sign in with NUportal
        </Button>
      </div>
    </div>
  );
};