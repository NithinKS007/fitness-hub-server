import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { UploadSignature } from "@application/dtos/service/cloud.storage.service";
import { ICloudStorageService } from "@di/file-imports-index";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";

@injectable()
export class CloudinaryUseCase {
  constructor(
    @inject(TYPES_SERVICES.CloudStorageService)
    private cloudinaryService: ICloudStorageService
  ) {}

  async execute(folder: string, userId: string): Promise<UploadSignature> {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const randomNum = Math.floor(Math.random() * 1000000);

    const uniqueId = `${userId}_${timestamp}_${randomNum}`;
    const publicId = `${uniqueId}`;

    const signature = await this.cloudinaryService.getSignature({
      folder,
      publicId,
      timestamp,
    });

    if (!signature) {
      throw new validationError(ApplicationStatus.FailedToGenSignature);
    }

    return signature;
  }
}
