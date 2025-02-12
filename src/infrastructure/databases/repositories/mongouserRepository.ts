import { CreateGoogleUserDTO, CreateUserDTO, FindEmailDTO ,Role,trainerVerification,updateBlockStatus,UpdatePassword} from "../../../application/dtos";
import { User } from "../../../domain/entities/userEntity";
import { UserRepository } from "../../../domain/interfaces/userRepository";
import userModel from "../models/userModel";

export class MongoUserRepository implements UserRepository {
  public async createUser(data: CreateUserDTO): Promise<User> {
    const userData = await userModel.create(data);
    return userData.toObject();
  }

  public async findUserByEmail(data: FindEmailDTO): Promise<User | null> {
    const {email} = data
    return await userModel.findOne({ email});
  }
  public async updateUserVerificationStatus(data:FindEmailDTO):Promise<User | null>{
    const {email} = data
    return await userModel.findOneAndUpdate({email},{otpVerified:true})
  }
  public async resetPassword(data:UpdatePassword):Promise<User | null> {
    const {email,password} = data
    return await userModel.findOneAndUpdate({email},{password:password})
  }
  public async createGoogleUser(data:CreateGoogleUserDTO):Promise<User | null> {
    return await userModel.create(data)
  }
  public async getUsers(data:Role):Promise<User[]>{
    return await userModel.find({role:data}).sort({createdAt:-1})
  }
  public async updateBlockStatus(data:updateBlockStatus):Promise<User | null> {
    const { _id , isBlocked} = data
    return await userModel.findByIdAndUpdate(_id, { isBlocked: isBlocked }, { new: true })
  }
  // public async getTrainersApprovalRejectionList():Promise<User[]>{
  //   return await userModel.find({role:"trainer","trainerData.isApproved":false,$or:[{otpVerified:true},{googleVerified:true}]})
  // }
  public async trainerVerification(data:trainerVerification):Promise<User | null>{
    const { _id , action} = data
    if(action==="approved"){
      return await userModel.findByIdAndUpdate(_id,{"trainerData.isApproved":true}, { new: true })
    }
    if(action==="rejected"){
      return await userModel.findByIdAndDelete(_id)
    }
    return null; 
  }
}
