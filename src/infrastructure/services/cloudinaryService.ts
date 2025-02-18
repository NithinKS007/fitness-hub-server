import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";

export const cloudinaryUpload = async (
  image: string,
  folder: string,
): Promise<string> => {
  try {
    const uploadOptions: any = {
        folder: folder,
      };
    const result: UploadApiResponse = await cloudinary.uploader.upload(image, uploadOptions)
    return result.secure_url;
  } catch (error:any) {
    console.log("Error while uploading the image:", error);
    throw new Error("Image upload failed.");
  }
}
