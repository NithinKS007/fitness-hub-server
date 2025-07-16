import { UploadApiResponse } from "cloudinary";
import cloudinary from "@infrastructure/config/cloudinary.config";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { ICloudStorageService } from "@application/interfaces/services/storage/ICloud.storage.service";
import {
  GenerateURLDTO,
  UploadImage,
  UploadSignature,
} from "@application/dtos/service/cloud.storage.service";
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

  async getSignature(generateURL: GenerateURLDTO): Promise<UploadSignature> {
    try {
      const { folder, publicId, timestamp } = generateURL;

      const cloudName = cloudinary.config().cloud_name;
      const apiSecret = cloudinary.config().api_secret;
      const apiKey = cloudinary.config().api_key;

      if (!apiSecret || !folder || !publicId || !apiKey || !cloudName) {
        throw new validationError(ApplicationStatus.AllFieldsAreRequired);
      }

      const paramsToSign = {
        timestamp: timestamp,
        folder: folder,
        public_id: publicId,
      };

      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        apiSecret
      );

      return {
        signature,
        timestamp,
        apiKey,
        publicId,
        cloudName,
        folder,
      };
      
    } catch (error: any) {
      console.log(
        "Error while generating signature from cloudinary:",
        error.message
      );
      throw new validationError(ApplicationStatus.FailedToGenSignature);
    }
  }
}
