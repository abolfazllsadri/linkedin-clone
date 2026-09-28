import { getCloudinarySignature } from "@/actions/cloudinary";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export function validateMedia(file: File) {
  if (file.type.startsWith("image/")) {
    if (file.size > MAX_IMAGE_SIZE) {
      return "Image must be smaller than 5MB.";
    }

    return null;
  }

  if (file.type.startsWith("video/")) {
    if (file.size > MAX_VIDEO_SIZE) {
      return "Video must be smaller than 50MB.";
    }

    return null;
  }

  return "Unsupported file type.";
}

export async function uploadToCloudinary(file: File, type: "image" | "video") {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset)
    throw new Error("Cloudinary environment variables are missing");

  const resourceType = type === "image" ? "image" : "video";

  const signature = await getCloudinarySignature(resourceType);

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("public_id", signature.publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error?.message || "Cloudinary upload failed");
  }

  const data = await response.json();

  return {
    secureUrl: data.secure_url as string,
    publicId: data.public_id as string,
    resourceType: data.resource_type as "image" | "video",
  };
}
