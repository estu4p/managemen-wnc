"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadMultipleToCloudinary(
  files: File[]
): Promise<{ urls: string[]; error?: string }> {
  try {
    if (!files || files.length === 0) {
      return { urls: [], error: "No files provided" };
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64String = `data:${file.type};base64,${buffer.toString(
        "base64"
      )}`;

      const result = await cloudinary.uploader.upload(base64String, {
        folder: "wnc-invoices-items",
        resource_type: "auto",
      });

      return result.secure_url;
    });

    const urls = await Promise.all(uploadPromises);
    return { urls };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { urls: [], error: "Failed to upload images to Cloudinary" };
  }
}
