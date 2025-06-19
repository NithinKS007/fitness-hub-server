import { UploadApiResponse } from "cloudinary";
import cloudinary from "@infrastructure/config/cloudinary.config";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { ICloudStorageService } from "@application/interfaces/storage/ICloud.storage.service";
import { UploadImage } from "@application/dtos/service/cloud.storage.service";
import { injectable } from "inversify";

@injectable()
export class CloudinaryService implements ICloudStorageService {
  async uploadImage(uploadImage: UploadImage): Promise<string> {
    try {
      const { image, folder } = uploadImage;
      const uploadOptions = { folder };
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        image,
        uploadOptions
      );
      return result.secure_url;
    } catch (error: any) {
      console.log("Error while uploading to cloudinary:", error.message);
      throw new validationError(ApplicationStatus.FailedToUploadToCloudinary);
    }
  }
}
