import { UploadImage } from "@application/dtos/service/cloud.storage.service";

export interface ICloudStorageService {
  uploadImage(uploadImage: UploadImage): Promise<string>;
}
