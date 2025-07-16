import {
  GenerateURLDTO,
  UploadImage,
  UploadSignature,
} from "@application/dtos/service/cloud.storage.service";

export interface ICloudStorageService {
  uploadImage(uploadImage: UploadImage): Promise<string>;
  getSignature(generateURL: GenerateURLDTO): Promise<UploadSignature>;
}
