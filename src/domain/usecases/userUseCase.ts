import { UserRepository } from "../interfaces/userRepository";
import { User } from "../entities/userEntity";
import { changePasswordDTO, IdDTO, Role, trainerVerification, updateBlockStatus, UpdateUserDetails} from "../../application/dtos";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { cloudinaryUpload } from "../../infrastructure/services/cloudinaryService";
import { comparePassword, hashPassword } from "../../shared/utils/hashPassword";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { TrainerWithSubscription } from "../entities/trainerWithSubscription";
import { SubscriptionRepository } from "../interfaces/subscriptionRepository";


export class UserUseCase {
  constructor(private userRepository:UserRepository ,private subscriptionRepository:SubscriptionRepository) {}
  
  public async getUsers(role:string): Promise<User[]> {

    if (role!== "user" && role !== "trainer") {
      throw new validationError(HttpStatusMessages.InvalidRole); 
    }
    return await this.userRepository.getUsers(role as Role)
  }

  
  public async updateBlockStatus(data:updateBlockStatus):Promise<User | null>{
     const { _id, isBlocked } = data
     if(!_id && isBlocked === undefined){
       throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
     }
    const userData = await this.userRepository.updateBlockStatus({_id,isBlocked})
    if(!userData){
      throw new validationError(HttpStatusMessages.FailedToUpdateBlockStatus)
    }
    return userData
  }


   public async trainerVerification(data:trainerVerification):Promise<User | null>{
    const { _id, action } = data

    console.log("action",action)
    if(!_id && action===undefined){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.userRepository.trainerVerification({_id,action})
  }


  public async updateUserProfile(data:UpdateUserDetails):Promise<User | null>{

     let {certifications,specifications,_id,...profileData} = data

    let result 
    if(certifications && certifications.length > 0){
        result = await Promise.all(
        certifications.map(async (certi) => {
          const base64 = await cloudinaryUpload(certi.url, process.env.CLOUDINARY_TRAINER_CERTIFICATES_FOLDER as string);
          const fileName = certi.fileName
          return { fileName, url:base64 };
        })
      )
         certifications = result
         await this.userRepository.updateCertifications({_id,certifications})
    }
    if(specifications && specifications.length > 0){
        await this.userRepository.updateSpecializations({_id,specifications})
    }

    if(data.profilePic){
       const url = await cloudinaryUpload( data.profilePic,process.env.CLOUDINARY_PROFILE_PIC_FOLDER as string)
       profileData.profilePic = url; 
    }

    const updatedUserData = await this.userRepository.updateUserProfile({_id,...profileData})
    if(!updatedUserData){
      throw new validationError(HttpStatusMessages.FailedToUpdateUserDetails)
    }

    return updatedUserData
  }


  public async getUserDetails(data:IdDTO):Promise<User | null>{

     if(!data){
      throw new validationError(HttpStatusMessages.IdRequired)
     }
    const userData = await this.userRepository.findUserById(data)

    if(!userData){
      throw new validationError(HttpStatusMessages.FailedToRetrieveUserDetails)
    }

    return userData
 }


 public async changePassword(data:changePasswordDTO):Promise<User| null> {

    if(!data){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }

    const userData = await this.userRepository.findUserById(data._id)
    if(!userData){
       throw new validationError(HttpStatusMessages.InvalidId)
    }

    const isValidPassword = await comparePassword(data.password,userData.password)

    if(!isValidPassword){
      throw new validationError(HttpStatusMessages.IncorrectPassword)
   }
    const hashedPassword = await hashPassword(data.newPassword)
    data.newPassword = hashedPassword
    return await this.userRepository.changePassword(data)
 }

 public async getApprovedTrainers():Promise<User []> {

  const trainersList = await this.userRepository.getApprovedTrainers()
  if(!trainersList){
     throw new validationError(HttpStatusMessages.FailedToRetrieveTrainersList)
  }

  return trainersList
}


 public async getTrainerWithSubscription(data:IdDTO):Promise<TrainerWithSubscription > {

  if(!data){
    throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
  }
  const trainerData = await this.userRepository.findUserById(data)
  if(!trainerData){
     throw new validationError(HttpStatusMessages.FailedToRetrieveTrainerDetails)
  }
  const trainerSubscriptionData = await this.subscriptionRepository.findSubscriptionByTrainerId(data)

  if(!trainerSubscriptionData){
    throw new validationError(HttpStatusMessages.FailedToRetrieveTrainerWithSubscription)
  }
  return {
    ...trainerData,
    trainerSubscriptionData:trainerSubscriptionData
  }

 }

 public async  getTrainerSearchSuggestions(query:string):Promise<string[]> {
  const suggestedData = await this.getTrainerSearchSuggestions(query)
  return suggestedData


 }
}
