import cloudinary from "../config/cloudinary.js";
import { UploadApiResponse } from "cloudinary";

export const uploadAvatar = async (fileBuffer: Buffer) => {
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "coursify/avatars",
        resource_type: "image",
        transformation: [
          {
            width: 300,
            height: 300,
            crop: "fill",
            gravity: "face",
          },
          {
            quality: "auto",
            fetch_format: "webp",
          },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      }
    );

    stream.end(fileBuffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

export const deleteImage = async (publicId: string) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};