import { CreateGoogleUserDTO, CreateUserDTO, FindEmailDTO ,UpdatePassword} from "../../../application/dtos";
import { User } from "../../../domain/entities/userEntity";
import { UserRepository } from "../../../domain/interfaces/userRepository";
import userModel from "../models/userModel";

export class MongoUserRepository implements UserRepository {
  public async createUser(data: CreateUserDTO): Promise<User> {
    const { fname, lname, email, password } = data;

    const userData = await userModel.create({
      fname,
      lname,
      email,
      password,
    });
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
}
