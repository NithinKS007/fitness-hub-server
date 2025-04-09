import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/entities/userEntity";
import { UpdateUserDetailsDTO } from "../dtos/userDTOs";
import { UpdateTrainerDetailsDTO } from "../dtos/trainerDTOs";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { cloudinaryUpload } from "../../infrastructure/services/cloudinaryService";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { TrainerRepository } from "../../domain/interfaces/trainerRepository";
import { Trainer } from "../../domain/entities/trainerEntity";
import dotenv from "dotenv";
dotenv.config()


export class UpdateProfileUseCase {
  constructor( private userRepository: UserRepository, private trainerRepository: TrainerRepository) {}
  public async updateTrainerProfile(data: UpdateTrainerDetailsDTO): Promise<Trainer | null> {

    let { _id, yearsOfExperience, certifications, specializations, userId,aboutMe, ...profileData } = data;
    
    const updatedCertifications: any[] = [];
    const updatedSpecializations: any[] = []

    if (certifications && certifications.length > 0 ) {
        await Promise.all(certifications.map(async (certi) => {
          if(certi && !certi.url.includes("cloudinary.com")){
            const base64 = await cloudinaryUpload(certi.url,process.env.CLOUDINARY_TRAINER_CERTIFICATES_FOLDER as string);
            const fileName = certi.fileName;
            updatedCertifications.push({ fileName, url: base64 });
          }
        })
      );
    }

    if (specializations && specializations.length > 0) {
      updatedSpecializations.push(...specializations);
    }

    if (data?.profilePic && !data.profilePic.includes("cloudinary.com")) {
      const url = await cloudinaryUpload(data.profilePic, process.env.CLOUDINARY_PROFILE_PIC_FOLDER as string);
      profileData.profilePic = url;
    }
    const updatedTrainerCollection = await this.trainerRepository.updateTrainerSpecificData({
        _id,
        certifications: updatedCertifications,
        specializations: updatedSpecializations,
        yearsOfExperience,
        aboutMe,
      })
    const updatedTrainerDataFromUserCollection = await this.userRepository.updateUserProfile({ _id:userId, ...profileData });
    const trainerData = Object.assign({},updatedTrainerDataFromUserCollection,updatedTrainerCollection,)
    return trainerData
  }

  public async updateUserProfile( data: UpdateUserDetailsDTO): Promise<User | null> {
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
