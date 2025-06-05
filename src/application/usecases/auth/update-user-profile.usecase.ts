import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User } from "../../../domain/entities/user.entities";
import { UpdateUserDetailsDTO } from "../../dtos/user-dtos";
import {
  AuthStatus,
  ProfileStatus,
} from "../../../shared/constants/index.constants";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import dotenv from "dotenv";
import { ICloudStorageService } from "../../interfaces/storage/ICloud.storage.service";
dotenv.config();

export class UpdateUserProfileUseCase {
  constructor(
    private userRepository: IUserRepository,
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

  async execute(
    profileUpdationData: UpdateUserDetailsDTO
  ): Promise<User | null> {
    const { userId, ...profileData } = profileUpdationData;
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const { profilePic } = profileUpdationData;
    const url = await this.uploadtoCloud(profilePic, this.profileFolder);
    profileData.profilePic = url;
    const updatedUserData = await this.updateUserData(userId, profileData);
    if (!updatedUserData) {
      throw new validationError(ProfileStatus.FailedToUpdateUserDetails);
    }
    return updatedUserData;
  }
}
