import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, Mic, Volume2, VolumeX } from "lucide-react";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isCameraEnabled: boolean;
  isMicEnabled: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
}

interface DeviceState {
  videoinput: MediaDeviceInfo[];
  audioinput: MediaDeviceInfo[];
  audiooutput: MediaDeviceInfo[];
}

type InputMode = "voice" | "push";

export const Settings = ({
  isOpen,
  isCameraEnabled,
  isMicEnabled,
  onToggleCamera,
  onToggleMic,
}: SettingsProps) => {
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [inputSensitivity, setInputSensitivity] = useState(50);
  const [audioVolume, setAudioVolume] = useState(75);
  const [selectedCamera, setSelectedCamera] = useState<string>("default");
  const [selectedMic, setSelectedMic] = useState<string>("default");
  const [selectedAudioOutput, setSelectedAudioOutput] =
    useState<string>("default");
  const [devices, setDevices] = useState<DeviceState>({
    videoinput: [],
    audioinput: [],
    audiooutput: [],
  });

  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleVoiceActivationChange = (checked: boolean) => {
    if (checked) {
      setInputMode("voice");
    }
  };

  const handlePushToTalkChange = (checked: boolean) => {
    if (checked) {
      setInputMode("push");
    }
  };

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const groupedDevices = devices.reduce<DeviceState>(
          (acc, device) => {
            switch (device.kind) {
              case "videoinput":
                acc.videoinput.push(device);
                break;
              case "audioinput":
                acc.audioinput.push(device);
                break;
              case "audiooutput":
                acc.audiooutput.push(device);
                break;
            }
            return acc;
          },
          { videoinput: [], audioinput: [], audiooutput: [] },
        );

        setDevices(groupedDevices);

        // Set default selections if devices are available
        if (groupedDevices.videoinput.length) {
          setSelectedCamera(groupedDevices.videoinput[0].deviceId || "default");
        }
        if (groupedDevices.audioinput.length) {
          setSelectedMic(groupedDevices.audioinput[0].deviceId || "default");
        }
        if (groupedDevices.audiooutput.length) {
          setSelectedAudioOutput(
            groupedDevices.audiooutput[0].deviceId || "default",
          );
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    if (isOpen) {
      getDevices();
    }
  }, [isOpen]);

  useEffect(() => {
    const setupPreview = async () => {
      if (!isCameraEnabled || !selectedCamera || !previewVideoRef.current) {
        if (previewVideoRef.current?.srcObject) {
          const stream = previewVideoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          previewVideoRef.current.srcObject = null;
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera === "default" ? undefined : selectedCamera,
          },
        });
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error setting up camera preview:", error);
      }
    };

    if (isOpen) {
      setupPreview();
    }

    return () => {
      if (previewVideoRef.current?.srcObject) {
        const stream = previewVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedCamera, isCameraEnabled, isOpen]);

  const playTestSound = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = audioVolume / 100;
    oscillator.frequency.value = 440;
    oscillator.type = "sine";

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="z-[9999]">
      <Card
        className="w-[600px] bg-gray-900/95 border-gray-600 text-white absolute top-16 right-0 z-[100] shadow-xl"
        onClick={handleMenuClick}
      >
        <CardHeader>
          <CardTitle>Input/Output Configuration</CardTitle>
          <CardDescription className="text-gray-400">
            Configure your camera and audio settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rest of the JSX remains the same */}
          {/* Camera Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                <h3 className="text-lg font-medium">Camera</h3>
              </div>
              <Switch
                checked={isCameraEnabled}
                onCheckedChange={onToggleCamera}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label>Camera Device</Label>
                <Select
                  disabled={!isCameraEnabled}
                  value={selectedCamera}
                  onValueChange={setSelectedCamera}
                  onOpenChange={(open) => {
                    if (open) {
                      navigator.mediaDevices
                        .enumerateDevices()
                        .then((devices) => {
                          const videoDevices = devices.filter(
                            (d) => d.kind === "videoinput",
                          );
                          setDevices((prev) => ({
                            ...prev,
                            videoinput: videoDevices,
                          }));
                        });
                    }
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Camera</SelectItem>
                    {devices.videoinput.map((device) => (
                      <SelectItem
                        key={device.deviceId}
                        value={device.deviceId || "default"}
                      >
                        {device.label ||
                          `Camera ${device.deviceId.slice(0, 5)}...`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px] h-[113px] bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                <video
                  ref={previewVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Microphone Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                <h3 className="text-lg font-medium">Microphone</h3>
              </div>
              <Switch checked={isMicEnabled} onCheckedChange={onToggleMic} />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Microphone Device</Label>
                <Select
                  disabled={!isMicEnabled}
                  value={selectedMic}
                  onValueChange={setSelectedMic}
                  onOpenChange={(open) => {
                    if (open) {
                      navigator.mediaDevices
                        .enumerateDevices()
                        .then((devices) => {
                          const audioDevices = devices.filter(
                            (d) => d.kind === "audioinput",
                          );
                          setDevices((prev) => ({
                            ...prev,
                            audioinput: audioDevices,
                          }));
                        });
                    }
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select microphone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Microphone</SelectItem>
                    {devices.audioinput.map((device) => (
                      <SelectItem
                        key={device.deviceId}
                        value={device.deviceId || "default"}
                      >
                        {device.label ||
                          `Mic ${device.deviceId.slice(0, 5)}...`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="push-to-talk"
                    checked={inputMode === "push"}
                    onCheckedChange={handlePushToTalkChange}
                    disabled={!isMicEnabled}
                  />
                  <Label
                    htmlFor="push-to-talk"
                    className={!isMicEnabled ? "text-gray-500" : ""}
                  >
                    Push to Talk
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="voice-activation"
                    checked={inputMode === "voice"}
                    onCheckedChange={handleVoiceActivationChange}
                    disabled={!isMicEnabled}
                  />
                  <Label
                    htmlFor="voice-activation"
                    className={!isMicEnabled ? "text-gray-500" : ""}
                  >
                    Voice Activation
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className={!isMicEnabled ? "text-gray-500" : ""}>
                  Input Sensitivity
                </Label>
                <div className="flex items-center gap-4">
                  <VolumeX className="h-4 w-4 text-gray-400" />
                  <Slider
                    disabled={!isMicEnabled || inputMode === "push"}
                    value={[inputSensitivity]}
                    onValueChange={([value]) => setInputSensitivity(value)}
                    max={100}
                    step={1}
                    className={`flex-1 ${
                      !isMicEnabled || inputMode === "push" ? "opacity-50" : ""
                    }`}
                  />
                  <Volume2 className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Audio Output Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              <h3 className="text-lg font-medium">Audio Output</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Output Device</Label>
                <Select
                  value={selectedAudioOutput}
                  onValueChange={setSelectedAudioOutput}
                  onOpenChange={(open) => {
                    if (open) {
                      navigator.mediaDevices
                        .enumerateDevices()
                        .then((devices) => {
                          const audioDevices = devices.filter(
                            (d) => d.kind === "audiooutput",
                          );
                          setDevices((prev) => ({
                            ...prev,
                            audiooutput: audioDevices,
                          }));
                        });
                    }
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select speaker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Speaker</SelectItem>
                    {devices.audiooutput.map((device) => (
                      <SelectItem
                        key={device.deviceId}
                        value={device.deviceId || "default"}
                      >
                        {device.label ||
                          `Speaker ${device.deviceId.slice(0, 5)}...`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Output Volume</Label>
                <div className="flex items-center gap-4">
                  <VolumeX className="h-4 w-4 text-gray-400" />
                  <Slider
                    value={[audioVolume]}
                    onValueChange={([value]) => setAudioVolume(value)}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Volume2 className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={playTestSound}
                className="w-full bg-gray-800 border-gray-600 hover:bg-gray-700"
              >
                Test Audio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

