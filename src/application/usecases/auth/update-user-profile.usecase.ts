import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { UpdateUserDetailsDTO } from "@application/dtos/user-dtos";
import { AuthStatus, ProfileStatus } from "@shared/constants/index.constants";
import {
  InternalServerError,
  NotFoundError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import dotenv from "dotenv";
import { ICloudStorageService } from "@application/interfaces/services/storage/ICloud.storage.service";
import { User } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IUpdateUserProfileUC } from "@application/interfaces/usecases/IAuthUC";
dotenv.config();

/**
 * Purpose: Handles the logic for updating the user's profile.
 * Incoming: { userId, profilePic, ...profileData } - Data required to update the user profile.
 * Returns: IUser - Updated user profile data.
 * Throws: Error if userId is missing or update fails.
 */

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUC {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_SERVICES.CloudStorageService)
    private cloudinaryService: ICloudStorageService,
    private profileFolder: string = process.env
      .CLOUDINARY_PROFILE_PIC_FOLDER as string
  ) {}

  private async uploadtoCloud(image: string, folder: string): Promise<string> {
    if (image && !image.includes("cloudinary.com")) {
      return await this.cloudinaryService.uploadImage({ image, folder });
    }
    return image;
  }
  private async updateUserData(userId: string, profileData: any) {
    return await this.userRepository.update(userId, {
      ...profileData,
    });
  }

  async execute(profileUpdationData: UpdateUserDetailsDTO): Promise<User> {
    const { userId, ...profileData } = profileUpdationData;
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }

    const userData = await this.userRepository.findById(userId);

    if (!userData) {
      throw new NotFoundError(AuthStatus.IdRequired);
    }

    const { profilePic } = profileUpdationData;
    const url = await this.uploadtoCloud(profilePic, this.profileFolder);
    profileData.profilePic = url;
    const updatedUserData = await this.updateUserData(userId, profileData);
    if (!updatedUserData) {
      throw new InternalServerError(ProfileStatus.UpdateFailed);
    }
    return updatedUserData;
  }
}
