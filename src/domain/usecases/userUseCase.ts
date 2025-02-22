import { UserRepository } from "../interfaces/userRepository";
import { User } from "../entities/userEntity";
import { changePasswordDTO, IdDTO, Role, trainerVerification, updateBlockStatus, UpdateUserDetails} from "../../application/dtos";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { cloudinaryUpload } from "../../infrastructure/services/cloudinaryService";
import { comparePassword, hashPassword } from "../../shared/utils/hashPassword";


export class UserUseCase {
  constructor(private userRepository:UserRepository) {}
  
  public async getUsers(role:string): Promise<User[]> {

    console.log("Received role parameter:", role);

    if (role!== "user" && role !== "trainer") {
      throw new Error(HttpStatusMessages.InvalidRole); 
    }
    return await this.userRepository.getUsers(role as Role)
  }
  public async updateBlockStatus(data:updateBlockStatus):Promise<User | null>{
     const { _id, isBlocked } = data
     if(!_id && isBlocked === undefined){
       throw new Error(HttpStatusMessages.AllFieldsAreRequired)
     }
    const userData = await this.userRepository.updateBlockStatus({_id,isBlocked})
    if(!userData){
      throw new Error(HttpStatusMessages.FailedToUpdateBlockStatus)
    }
    return userData
  }
   public async trainerVerification(data:trainerVerification):Promise<User | null>{
    const { _id, action } = data
    if(!_id && action===undefined){
      throw new Error(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.userRepository.trainerVerification({_id,action})
  }
  public async updateUserProfile(data:UpdateUserDetails):Promise<User | null>{

     let {certifications,specifications,_id,...profileData} = data

     console.log("certificatinos",certifications)

    let result 
    if(certifications && certifications.length > 0){
      console.log("certificatinossdfdsfs",certifications)
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
      throw new Error(HttpStatusMessages.FailedToUpdateUserDetails)
    }

    console.log("data from base",updatedUserData)
    return updatedUserData
  }
  public async getUserDetails(data:IdDTO):Promise<User | null>{

     if(!data){
      throw new Error(HttpStatusMessages.IdRequired)
     }
    const userData = await this.userRepository.findUserById(data)

    if(!userData){
      throw new Error(HttpStatusMessages.FailedToRetrieveUserDetails)
    }

    console.log("returned data",userData)
    return userData
 }

 public async changePassword(data:changePasswordDTO):Promise<User| null> {

   console.log("passsword coming",data)
    if(!data){
      throw new Error(HttpStatusMessages.AllFieldsAreRequired)
    }

    const userData = await this.userRepository.findUserById(data._id)
    if(!userData){
       throw new Error(HttpStatusMessages.InvalidId)
    }

    const isValidPassword = await comparePassword(data.password,userData.password)

    if(!isValidPassword){
      throw new Error(HttpStatusMessages.IncorrectPassword)
   }
    const hashedPassword = await hashPassword(data.newPassword)
    data.newPassword = hashedPassword
    return await this.userRepository.changePassword(data)
 }
}
