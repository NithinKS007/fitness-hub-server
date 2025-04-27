import { UploadImage } from "../../dtos/serviceDTOs/cloudStorageServiceDTOs";

export interface ICloudStorageService {
  uploadImage(uploadImage: UploadImage): Promise<string>;
}
