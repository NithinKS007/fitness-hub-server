import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { UpdateUserDetailsDTO } from "@application/dtos/user-dtos";
import { AuthStatus, ProfileStatus } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import dotenv from "dotenv";
import { ICloudStorageService } from "@application/interfaces/storage/ICloud.storage.service";
import { IUser } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";
import { TYPES_SERVICES } from "di/types-services";
dotenv.config();

/**
 * Purpose: Handles the logic for updating the user's profile.
 * Incoming: { userId, profilePic, ...profileData } - Data required to update the user profile.
 * Returns: IUser - Updated user profile data.
 * Throws: Error if userId is missing or update fails.
 */

@injectable()
export class UpdateUserProfileUseCase {
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

  async execute(profileUpdationData: UpdateUserDetailsDTO): Promise<IUser> {
    const { userId, ...profileData } = profileUpdationData;
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const { profilePic } = profileUpdationData;
    const url = await this.uploadtoCloud(profilePic, this.profileFolder);
    profileData.profilePic = url;
    const updatedUserData = await this.updateUserData(userId, profileData);
    if (!updatedUserData) {
      throw new validationError(ProfileStatus.UpdateFailed);
    }
    return updatedUserData;
  }
}
