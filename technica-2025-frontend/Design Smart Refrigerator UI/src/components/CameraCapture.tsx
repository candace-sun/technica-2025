"use client";

import { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

interface CameraScanProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onItemsDetected: (items: any[]) => void;
}

export default function CameraCapture({ isOpen, onClose, userId, onItemsDetected }: CameraScanProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);

  // Stop camera when modal closes
  useEffect(() => {
    if (!isOpen) stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setStream(mediaStream);
    } catch (err) {
      console.error(err);
      alert("Camera access failed: " + (err as Error).message);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
      handleFileUpload(file);
    });

    stopCamera();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileUpload(file);
  };

  const handleFileUpload = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setUploadedFile(file);
    setUploaded(false);

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/detect-food", { method: "POST", body: formData });
      const data = await res.json();
      if (data.items_saved) {
        onItemsDetected(data.items_saved);
        setUploaded(true);
      } else {
        alert(data.result || "Food detection failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + (err as Error).message);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setUploadedFile(null);
    setUploaded(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl p-4">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-[var(--eco-green)]">📸 Camera & Upload</DialogTitle>
          <DialogDescription className="text-center text-[var(--eco-dark)]/70 text-sm">
            Take a photo or upload an image of your food
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Camera preview */}
          {stream && (
            <video ref={videoRef} className="w-full h-64 object-cover rounded-xl border" autoPlay playsInline muted />
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Camera Buttons */}
          {!stream && !preview && (
            <Button onClick={startCamera} className="w-full bg-[var(--eco-green)] text-white rounded-xl h-12">
              Start Camera
            </Button>
          )}
          {stream && (
            <Button onClick={takePhoto} className="w-full bg-[var(--eco-green)] text-white rounded-xl h-12">
              Take Photo
            </Button>
          )}

          {/* Upload Button */}
          <label className="w-full">
            <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
            <Button
              className={`w-full rounded-xl h-12 ${
                uploaded ? "bg-[var(--eco-green)] text-white" : "bg-white text-[var(--eco-dark)] border-2 border-[var(--eco-green)]"
              }`}
            >
              {uploaded ? "Uploaded" : "Upload Photo"}
            </Button>
          </label>

          {/* Reupload */}
          {preview && (
            <label className="w-full">
              <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              <Button className="w-full bg-[var(--eco-yellow)] text-[var(--eco-dark)] rounded-xl h-12 mt-2">
                Reupload
              </Button>
            </label>
          )}

          {/* Image Preview */}
          {preview && (
            <div className="relative text-center">
              <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-xl shadow-md mt-2" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 p-1 rounded-full text-white hover:bg-red-600"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button onClick={() => { stopCamera(); onClose(); }} variant="outline" className="w-full rounded-xl border-2 border-[var(--eco-green)]/30">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
