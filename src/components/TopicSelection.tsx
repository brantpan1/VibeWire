import { type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface TopicSelectionProps {
  onTopicSubmit: (topic: string) => void;
  currentTopic: string;
  setCurrentTopic: (topic: string) => void;
  isSearching: boolean;
}

const TopicSelection = ({
  onTopicSubmit,
  currentTopic,
  setCurrentTopic,
  isSearching,
}: TopicSelectionProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentTopic.trim()) {
      onTopicSubmit(currentTopic);
    }
  };

  const handleTopicChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentTopic(e.target.value);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-[400px] bg-gray-800/90 border-gray-600">
        <CardHeader>
          <CardTitle className="text-2xl text-white">
            Start a Conversation
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter a topic you'd like to discuss with someone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="e.g., Photography, Music, Travel..."
                value={currentTopic}
                onChange={handleTopicChange}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
              {currentTopic.trim() === "" && (
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Please enter a topic to start chatting</span>
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              disabled={currentTopic.trim() === "" || isSearching}
            >
              {isSearching ? "Finding a match..." : "Start Chatting"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicSelection;

