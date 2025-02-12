import { UserRepository } from "../interfaces/userRepository";
import { User } from "../entities/userEntity";
import { Role, trainerVerification, updateBlockStatus } from "../../application/dtos";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";


export class UserUseCase {
  constructor(private userRepository:UserRepository) {}
  
  public async getUsers(role:string): Promise<User[]> {
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
  // public async getTrainersApprovalRejectionList():Promise<User[]>{
  //   return await this.userRepository.getTrainersApprovalRejectionList()
  // }
   public async trainerVerification(data:trainerVerification):Promise<User | null>{
    const { _id, action } = data
    if(!_id && action===undefined){
      throw new Error(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.userRepository.trainerVerification({_id,action})
  }
}
