import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { User } from "../../domain/entities/userEntity";
import { UpdateUserDetailsDTO } from "../dtos/userDTOs";
import { UpdateTrainerDetailsDTO } from "../dtos/trainerDTOs";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { cloudinaryUpload } from "../../infrastructure/services/cloudinaryService";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { ITrainerRepository } from "../../domain/interfaces/ITrainerRepository";
import { Trainer } from "../../domain/entities/trainerEntity";
import dotenv from "dotenv";
dotenv.config();

export class UpdateProfileUseCase {
  constructor(
    private userRepository: IUserRepository,
    private trainerRepository: ITrainerRepository
  ) {}
  public async updateTrainerProfile({
    trainerId,
    yearsOfExperience,
    certifications,
    specializations,
    userId,
    aboutMe,
    profilePic,
    ...profileData
  }: UpdateTrainerDetailsDTO): Promise<Trainer | null> {
    const updatedCertifications: any[] = [];
    const updatedSpecializations: any[] = [];
    let newProfilePic: string;

    if (certifications && certifications.length > 0) {
      await Promise.all(
        certifications.map(async (certi) => {
          if (certi && !certi.url.includes("cloudinary.com")) {
            const base64 = await cloudinaryUpload(
              certi.url,
              process.env.CLOUDINARY_TRAINER_CERTIFICATES_FOLDER as string
            );
            const fileName = certi.fileName;
            updatedCertifications.push({ fileName, url: base64 });
          }
        })
      );
    }

    if (specializations && specializations.length > 0) {
      updatedSpecializations.push(...specializations);
    }

    if (profilePic && !profilePic.includes("cloudinary.com")) {
      const url = await cloudinaryUpload(
        profilePic,
        process.env.CLOUDINARY_PROFILE_PIC_FOLDER as string
      );
      newProfilePic = url;
    } else {
      newProfilePic = profilePic;
    }
    const updatedTrainerCollection =
      await this.trainerRepository.updateTrainerSpecificData({
        trainerId,
        certifications: updatedCertifications,
        specializations: updatedSpecializations,
        yearsOfExperience,
        aboutMe,
      });
    const updatedTrainerDataFromUserCollection =
      await this.userRepository.updateUserProfile({
        userId: userId,
        profilePic: newProfilePic,
        ...profileData,
      });
    const trainerData = Object.assign(
      {},
      updatedTrainerDataFromUserCollection,
      updatedTrainerCollection
    );
    return trainerData;
  }

  public async updateUserProfile(
    profileUpdationData: UpdateUserDetailsDTO
  ): Promise<User | null> {
    const { userId, ...profileData } = profileUpdationData;
    if (!userId) {
      throw new validationError(HttpStatusMessages.IdRequired);
    }
    if (profileUpdationData.profilePic) {
      const url = await cloudinaryUpload(
        profileUpdationData.profilePic,
        process.env.CLOUDINARY_PROFILE_PIC_FOLDER as string
      );
      profileData.profilePic = url;
    }
    const updatedUserData = await this.userRepository.updateUserProfile({
      userId,
      ...profileData,
    });
    if (!updatedUserData) {
      throw new validationError(HttpStatusMessages.FailedToUpdateUserDetails);
    }
    return updatedUserData;
  }
}
