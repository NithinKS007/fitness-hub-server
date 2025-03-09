import { UserRepository } from "../interfaces/userRepository";
import { User } from "../entities/userEntity";
import {
  UpdateTrainerDetails,
  UpdateUserDetails,
} from "../../application/dtos";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { cloudinaryUpload } from "../../infrastructure/services/cloudinaryService";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { TrainerRepository } from "../interfaces/trainerRepository";
import { Trainer } from "../entities/trainerEntity";

export class UpdateProfileUseCase {
  constructor(
    private userRepository: UserRepository,
    private trainerRepository: TrainerRepository
  ) {}
  public async updateTrainerProfile(data: UpdateTrainerDetails): Promise<Trainer | null> {

    let { _id, yearsOfExperience, certifications, specializations, aboutMe, ...profileData } = data;
    
    const updatedCertifications: any[] = [];
    const updatedSpecializations: any[] = [];

    if (certifications && certifications.length > 0) {
        await Promise.all(certifications.map(async (certi) => {
          const base64 = await cloudinaryUpload(certi.url,process.env.CLOUDINARY_TRAINER_CERTIFICATES_FOLDER as string);
          const fileName = certi.fileName;
          updatedCertifications.push({ fileName, url: base64 });
        })
      );
    }

    if (specializations && specializations.length > 0) {
      updatedSpecializations.push(...specializations);
    }

    if (data?.profilePic) {
      const url = await cloudinaryUpload(data.profilePic, process.env.CLOUDINARY_PROFILE_PIC_FOLDER as string);
      profileData.profilePic = url;
    }

    console.log("id received updation",_id,updatedCertifications,updatedSpecializations, yearsOfExperience,aboutMe,)
    const updatedTrainerCollection =
      await this.trainerRepository.updateTrainerSpecificData({
        _id,
        certifications: updatedCertifications,
        specializations: updatedSpecializations,
        yearsOfExperience,
        aboutMe,
      });

      console.log("trainer specific data",updatedTrainerCollection)
    const updatedTrainerDataFromUserCollection =
      await this.userRepository.updateUserProfile({ _id, ...profileData });

    const trainerData = Object.assign({},updatedTrainerDataFromUserCollection,updatedTrainerCollection,)

    console.log("trainer data after profile updation",trainerData)
    return trainerData
  }

  public async updateUserProfile( data: UpdateUserDetails): Promise<User | null> {
    const { _id, ...profileData } = data;
    if (!_id) {
      throw new validationError(HttpStatusMessages.IdRequired);
    }
    if (data.profilePic) {
      const url = await cloudinaryUpload( data.profilePic, process.env.CLOUDINARY_PROFILE_PIC_FOLDER as string);
      profileData.profilePic = url;
    }
    const updatedUserData = await this.userRepository.updateUserProfile({ _id,...profileData});
    if (!updatedUserData) {
      throw new validationError(HttpStatusMessages.FailedToUpdateUserDetails);
    }
    return updatedUserData;
  }
}
