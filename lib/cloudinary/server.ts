import { v2 as cloudinary } from "cloudinary";

export function getCloudinaryCloudName() {
  return (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
    process.env.CLOUDINARY_CLOUD_NAME ??
    ""
  );
}

cloudinary.config({
  cloud_name: getCloudinaryCloudName(),
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryPostMedia = {
  imagePublicId?: string;
  videoPublicId?: string;
};

export async function deleteFromCloudinary(
  post: CloudinaryPostMedia,
  userId: string,
) {
  const prefix = `linkedin-clone/users/${userId}/`;

  try {
    if (post.imagePublicId) {
      if (!post.imagePublicId.startsWith(prefix)) {
        console.warn("Invalid image public ID:", post.imagePublicId);
      } else {
        await cloudinary.uploader.destroy(post.imagePublicId, {
          resource_type: "image",
        });
      }
    }

    if (post.videoPublicId) {
      if (!post.videoPublicId.startsWith(prefix)) {
        console.warn("Invalid video public ID:", post.videoPublicId);
      } else {
        await cloudinary.uploader.destroy(post.videoPublicId, {
          resource_type: "video",
        });
      }
    }
  } catch (error) {
    console.error("Failed to remove Cloudinary media:", error);
  }
}

export default cloudinary;
