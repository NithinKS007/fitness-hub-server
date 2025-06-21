import { IUserRepository } from "@domain/interfaces/IUserRepository";
import {
  Trainer,
  UpdateTrainerDetailsDTO,
} from "@application/dtos/trainer-dtos";
import { ITrainerRepository } from "@domain/interfaces/ITrainerRepository";
import dotenv from "dotenv";
import { ICloudStorageService } from "@application/interfaces/storage/ICloud.storage.service";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
dotenv.config();

/**
 * Purpose: Handles updating trainer profile .
 * Incoming: { trainerId, yearsOfExperience, certifications, specializations, userId, profilePic, dateOfBirth, \
 * ...profileData }
 * Returns: Trainer  - The updated trainer profile data.
 * Throws: Error if any required data is missing or the update fails.
 */

@injectable()
export class UpdateTrainerProfileUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.TrainerRepository)
    private trainerRepository: ITrainerRepository,
    @inject(TYPES_SERVICES.CloudStorageService)
    private cloudinaryService: ICloudStorageService,
    private profileFolder: string = process.env
      .CLOUDINARY_PROFILE_PIC_FOLDER as string,
    private certificateFolder: string = process.env
      .CLOUDINARY_TRAINER_CERTIFICATES_FOLDER as string
  ) {}

  private async uploadtoCloud(image: string, folder: string): Promise<string> {
    if (image && !image.includes("cloudinary.com")) {
      return await this.cloudinaryService.uploadImage({ image, folder });
    }
    return image;
  }

  private async handleCertifications(certifications: any[]): Promise<any[]> {
    const updatedCertifications: { fileName: string; url: string }[] = [];
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
        } else {
          updatedCertifications.push(certi);
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

  async execute({
    trainerId,
    yearsOfExperience,
    certifications,
    specializations,
    userId,
    aboutMe,
    profilePic,
    dateOfBirth,
    _id,
    ...profileData
  }: UpdateTrainerDetailsDTO): Promise<Trainer> {
    const [updatedCertifications, updatedSpecializations, profilePicData] =
      await Promise.all([
        this.handleCertifications(certifications),
        this.handleSpecializations(specializations),
        this.uploadtoCloud(profilePic, this.profileFolder),
      ]);

    const updatedTrainerData = await this.trainerRepository.update(trainerId, {
      certifications: updatedCertifications,
      specializations: updatedSpecializations,
      yearsOfExperience,
      aboutMe,
    });

    const updatedTrainerUserData = await this.userRepository.update(userId, {
      profilePic: profilePicData,
      dateOfBirth: new Date(dateOfBirth),
      ...profileData,
    });

    const trainerData = Object.assign(
      {},
      updatedTrainerUserData,
      updatedTrainerData
    );
    return trainerData;
  }
}
