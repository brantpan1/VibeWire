import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, User } from "lucide-react";

interface ProfileData {
  name: string;
  major: string;
  bio: string;
  interests: string[];
  profilePicture: string | null;
}

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSettings = ({ isOpen }: ProfileSettingsProps) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    major: "",
    bio: "",
    interests: [],
    profilePicture: null,
  });

  const [newInterest, setNewInterest] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [originalData, setOriginalData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const mockData: ProfileData = {
      name: "",
      major: "",
      bio: "",
      interests: [],
      profilePicture: null,
    };
    setProfileData(mockData);
    setOriginalData(mockData);
  }, []);

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | string[],
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setIsEdited(true);
  };

  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newInterest.trim()) {
      if (!profileData.interests.includes(newInterest.trim())) {
        handleInputChange("interests", [
          ...profileData.interests,
          newInterest.trim(),
        ]);
      }
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    handleInputChange(
      "interests",
      profileData.interests.filter((i) => i !== interest),
    );
  };

  const handleSave = () => {
    console.log("Saving profile:", profileData);
    setOriginalData(profileData);
    setIsEdited(false);
  };

  const handleCancel = () => {
    if (originalData) {
      setProfileData(originalData);
      setIsEdited(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-0 z-[9999]">
      <Card className="w-[600px] bg-gray-900/95 border-gray-600 text-white shadow-xl">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Customize your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-600 overflow-hidden flex items-center justify-center">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-black hover:text-white hover:bg-gray-800"
            >
              Change Picture
            </Button>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          {/* Major Input */}
          <div className="space-y-2">
            <Label htmlFor="major" className="text-gray-300">
              Major
            </Label>
            <Input
              id="major"
              value={profileData.major}
              onChange={(e) => handleInputChange("major", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          {/* Bio Input */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-300">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white resize-none"
              rows={4}
            />
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label htmlFor="interests" className="text-gray-300">
              Interests
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 flex items-center gap-1"
                >
                  {interest}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveInterest(interest)}
                  />
                </Badge>
              ))}
            </div>
            <Input
              id="interests"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={handleAddInterest}
              placeholder="Type interest and press Enter"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Now outside the Card */}
      {isEdited && (
        <div className="flex justify-end gap-3 mt-4 pr-1">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
