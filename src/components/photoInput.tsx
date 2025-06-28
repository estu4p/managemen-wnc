"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

export default function PhotoInput() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleRemoveAll = () => {
    // Revoke all URLs to free memory
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
    const input = document.getElementById("photo-input") as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="photo-input">Upload Photo</Label>
        <div className="relative">
          <Input
            id="photo-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <Label
            htmlFor="photo-input"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </Label>
        </div>
      </div>

      {previewUrls.length > 0 && (
        <Card className="py-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {selectedFiles.length} photo
                    {selectedFiles.length > 1 ? "s" : ""} selected
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAll}
                  className="h-8 px-2"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-28 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 truncate">
                      {selectedFiles[index]?.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                Total size:{" "}
                {(
                  selectedFiles.reduce((acc, file) => acc + file.size, 0) /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
