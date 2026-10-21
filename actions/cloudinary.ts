"use server";

import cloudinary, { getCloudinaryCloudName } from "@/lib/cloudinary/server";
import { auth } from "@clerk/nextjs/server";

export async function getCloudinarySignature(resourceType: "image" | "video") {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const timestamp = Math.floor(Date.now() / 1000);

  const publicId = `linkedin-clone/users/${userId}/${crypto.randomUUID()}`;

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  if (!uploadPreset)
    throw new Error("Cloudinary upload preset is not configured");

  const signature = cloudinary.utils.api_sign_request(
    { public_id: publicId, timestamp, upload_preset: uploadPreset },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    timestamp,
    signature,
    publicId,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: getCloudinaryCloudName(),
    resourceType,
    uploadPreset,
  };
}
