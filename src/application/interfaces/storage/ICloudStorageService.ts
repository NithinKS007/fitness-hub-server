import { UploadImage } from "../../dtos/service/cloudStorageService";

export interface ICloudStorageService {
  uploadImage(uploadImage: UploadImage): Promise<string>;
}
