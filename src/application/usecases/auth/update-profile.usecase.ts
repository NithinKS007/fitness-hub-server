import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User } from "../../../domain/entities/user.entities";
import { UpdateUserDetailsDTO } from "../../dtos/user-dtos";
import { UpdateTrainerDetailsDTO } from "../../dtos/trainer-dtos";
import {
  AuthStatus,
  ProfileStatus,
} from "../../../shared/constants/index.constants";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { Trainer } from "../../../domain/entities/trainer.entities";
import dotenv from "dotenv";
import { ICloudStorageService } from "../../interfaces/storage/ICloud.storage.service";
dotenv.config();

export class UpdateProfileUseCase {
  private profileFolder: string = process.env
    .CLOUDINARY_PROFILE_PIC_FOLDER as string;
  private certificateFolder: string = process.env
    .CLOUDINARY_TRAINER_CERTIFICATES_FOLDER as string;

  constructor(
    private userRepository: IUserRepository,
    private trainerRepository: ITrainerRepository,
    private cloudinaryService: ICloudStorageService
  ) {}

  private async uploadtoCloud(image: string, folder: string): Promise<string> {
    if (image && !image.includes("cloudinary.com")) {
      return await this.cloudinaryService.uploadImage({ image, folder });
    }
    return image;
  }

  private async handleCertifications(certifications: any[]): Promise<any[]> {
    const updatedCertifications: any[] = [];
    if (certifications && certifications.length > 0) {
      const uploadPromises = certifications.map(async (certi) => {
        if (certi && !certi.url.includes("cloudinary.com")) {
          const base64 = await this.uploadtoCloud(
            certi.url,
            this.certificateFolder
          );
          updatedCertifications.push({
            fileName: certi.fileName,
            url: base64,
          });
        }
      });
      await Promise.all(uploadPromises);
    }
    return updatedCertifications;
  }

  private async handleSpecializations(
    specializations: string[]
  ): Promise<string[]> {
    return specializations.length > 0 ? [...specializations] : [];
  }

  private async updateTrainerData({
    trainerId,
    updatedCertifications,
    updatedSpecializations,
    yearsOfExperience,
    aboutMe,
  }: {
    trainerId: string;
    updatedCertifications: any[];
    updatedSpecializations: string[];
    yearsOfExperience: string;
    aboutMe: string;
  }) {
    return await this.trainerRepository.updateTrainerData({
      trainerId,
      certifications: updatedCertifications,
      specializations: updatedSpecializations,
      yearsOfExperience,
      aboutMe,
    });
  }

  private async updateUserData(userId: string, profileData: any) {
    return await this.userRepository.updateUserProfile({
      userId,
      ...profileData,
    });
  }

  async updateTrainerProfile({
    trainerId,
    yearsOfExperience,
    certifications,
    specializations,
    userId,
    aboutMe,
    profilePic,
    ...profileData
  }: UpdateTrainerDetailsDTO): Promise<Trainer | null> {
    const [updatedCertifications, updatedSpecializations, profilePicData] =
      await Promise.all([
        this.handleCertifications(certifications),
        this.handleSpecializations(specializations),
        this.uploadtoCloud(profilePic, this.profileFolder),
      ]);

    const updatedTrainerData = await this.updateTrainerData({
      trainerId,
      updatedCertifications,
      updatedSpecializations,
      yearsOfExperience,
      aboutMe,
    });

    const updatedTrainerUserData = await this.userRepository.updateUserProfile({
      userId: userId,
      profilePic: profilePicData,
      ...profileData,
    });
    const trainerData = Object.assign(
      {},
      updatedTrainerUserData,
      updatedTrainerData
    );
    return trainerData;
  }

  async updateUserProfile(
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
