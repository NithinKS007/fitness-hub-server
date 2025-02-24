import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";

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
    console.log("Error while uploading to cloudinary:", error);
    throw new validationError(HttpStatusMessages.FailedToUploadToCloudinary);
  }
}
