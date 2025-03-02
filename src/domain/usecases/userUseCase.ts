import { UserRepository } from "../interfaces/userRepository";
import { User } from "../entities/userEntity";
import { IdDTO, updateBlockStatus,} from "../../application/dtos";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";


export class UserUseCase {
  constructor(private userRepository:UserRepository ) {}
  
  public async getUsers(): Promise<User[]> {
    const userList =  await this.userRepository.getUsers()
    if(!userList){
      throw new validationError(HttpStatusMessages.failedToRetrieveUsersList)
    }
    return userList
  }

   public async getUserDetails(data:IdDTO):Promise<User | null>{
     if(!data){
      throw new validationError(HttpStatusMessages.IdRequired)
    }
    const userData = await this.userRepository.findById(data)
    if(!userData){
      throw new validationError(HttpStatusMessages.FailedToRetrieveUserDetails)
    }
    return userData
 }
  
  public async updateBlockStatus(data:updateBlockStatus):Promise<User | null>{
     const { _id, isBlocked } = data
     if(!_id && !isBlocked){
       throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
     }
    const userData = await this.userRepository.updateBlockStatus({_id,isBlocked})
    if(!userData){
      throw new validationError(HttpStatusMessages.FailedToUpdateBlockStatus)
    }
    return userData
  }
}
