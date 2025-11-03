"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, User } from "lucide-react";
import Image from "next/image";
import { AvatarFallback } from "./ui/avatar";

interface PhotoProfileInputProps {
  onFileChange?: (file: File | null) => void;
  onUrlChange?: (url: string) => void;
  existingPhoto?: string;
  isUploading?: boolean;
  customerName: string;
  isEditing: boolean;
}

const PhotoProfileInput = ({
  onFileChange,
  onUrlChange,
  existingPhoto = "",
  isUploading = false,
  customerName,
  isEditing = false,
}: PhotoProfileInputProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(existingPhoto);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isUploading) return;

      const file = event.target.files?.[0];
      if (file) {
        // Validasi tipe file
        if (!file.type.startsWith("image/")) {
          alert("Please select an image file");
          return;
        }

        // Validasi ukuran file (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("File size should be less than 5MB");
          return;
        }

        setSelectedFile(file);

        // Create preview URL
        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);

        // Call callbacks
        onFileChange?.(file);
        onUrlChange?.(newPreviewUrl);
      }
    },
    [onFileChange, onUrlChange, isUploading]
  );

  const handleRemoveFile = useCallback(() => {
    if (isUploading) return;

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(existingPhoto);

    const input = document.getElementById(
      "photo-profile-input"
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }

    onFileChange?.(null);
    onUrlChange?.(existingPhoto);
  }, [previewUrl, existingPhoto, onFileChange, onUrlChange, isUploading]);

  const hasPhoto = previewUrl && previewUrl !== "";

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className="flex items-start space-x-4">
          {/* Photo Preview */}
          <div className="relative size-8 rounded-full  overflow-hidden">
            {hasPhoto ? (
              <Image
                src={previewUrl}
                alt="Profile preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="size-9 w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-center">
                  {customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex gap-2 items-start">
            <div className="relative">
              <Input
                id="photo-profile-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading || isEditing}
              />
              <Label
                htmlFor="photo-profile-input"
                className={`flex items-center justify-center px-3 py-2 bg-primary-gray rounded-md cursor-pointer transition-colors ${
                  isUploading && "cursor-not-allowed"
                } ${isEditing && "bg-primary-gray/60"}`}
              >
                {isUploading && (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                )}
                Edit photo profile
              </Label>
              <h4 className="text-muted-foreground mt-2">Edit photo profile</h4>
            </div>

            {hasPhoto && (
              <Button
                variant="destructive"
                size="iconXs"
                onClick={handleRemoveFile}
                disabled={isUploading}
                type="button"
                className="mt-0.5"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {selectedFile && (
        <Card className="py-0">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Selected file:</span>
                  <span className="text-sm text-gray-500 truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              {isUploading && (
                <div className="text-xs text-blue-600">Uploading...</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhotoProfileInput;
