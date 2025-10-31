"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface PhotoInputProps {
  onFilesChange?: (files: File[]) => void;
  onUrlsChange?: (urls: string[]) => void;
  existingPhotos?: string[];
  itemIndex?: number;
  isUploading?: boolean;
}

const PhotoInput = ({
  onFilesChange,
  onUrlsChange,
  existingPhotos = [],
  itemIndex = 0,
  isUploading = false,
}: PhotoInputProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingPhotos);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isUploading) return;

      const files = Array.from(event.target.files || []);
      if (files.length > 0) {
        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);

        // Create preview URLs for new files
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
        const allPreviewUrls = [...previewUrls, ...newPreviewUrls];
        setPreviewUrls(allPreviewUrls);

        // Call callbacks dengan parameter yang benar
        onFilesChange?.(newFiles); // Ini mengirim File[]
        onUrlsChange?.(
          allPreviewUrls.filter((url) => !url.startsWith("blob:"))
        ); // Ini mengirim string[]
      }
    },
    [selectedFiles, previewUrls, onFilesChange, onUrlsChange, isUploading]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      if (isUploading) return;

      // Hapus file dari selectedFiles
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      onFilesChange?.(newFiles); // Kirim array file yang diperbarui

      // Hapus URL dari previewUrls
      const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

      // Revoke blob URL jika perlu
      if (previewUrls[index].startsWith("blob:")) {
        URL.revokeObjectURL(previewUrls[index]);
      }

      setPreviewUrls(newPreviewUrls);
      onUrlsChange?.(newPreviewUrls.filter((url) => !url.startsWith("blob:"))); // Kirim array URL yang diperbarui
    },
    [selectedFiles, previewUrls, onFilesChange, onUrlsChange, isUploading]
  );

  const handleRemoveAll = useCallback(() => {
    if (isUploading) return;

    // Revoke all blob URLs
    previewUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    setSelectedFiles([]);
    setPreviewUrls([]);

    const input = document.getElementById(
      `photo-input-${itemIndex}`
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }

    onFilesChange?.([]); // Kirim array kosong
    onUrlsChange?.([]); // Kirim array kosong
  }, [previewUrls, itemIndex, onFilesChange, onUrlsChange, isUploading]);

  const totalSizeMB =
    selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024;

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`photo-input-${itemIndex}`}>Upload Photo</Label>
        <div className="relative">
          <Input
            id={`photo-input-${itemIndex}`}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <Label
            htmlFor={`photo-input-${itemIndex}`}
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isUploading
                ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-2" />
              ) : (
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
              )}
              <p className="mb-2 text-sm text-gray-500">
                {isUploading
                  ? "Uploading..."
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </Label>
        </div>
      </div>

      {previewUrls.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {previewUrls.length} photo
                    {previewUrls.length > 1 ? "s" : ""} selected
                    {isUploading && " (Uploading...)"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAll}
                  className="h-8 px-2"
                  type="button"
                  disabled={isUploading}
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-28 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      {!isUploading && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 truncate">
                      {selectedFiles[index]?.name || `Photo ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>

              {selectedFiles.length > 0 && (
                <div className="text-xs text-gray-500">
                  Total size: {totalSizeMB.toFixed(2)} MB
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhotoInput;
