import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/entities/userEntity";
import { IdDTO, PaginationDTO } from "../dtos/utilityDTOs";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { UpdateBlockStatusDTO } from "../dtos/authDTOs";
import { GetUsersQueryDTO } from "../dtos/queryDTOs";


export class UserUseCase {
  constructor(private userRepository:UserRepository ) {}
  
  public async getUsers(data:GetUsersQueryDTO): Promise<{usersList:User[],paginationData:PaginationDTO}> {
    const {usersList,paginationData}=  await this.userRepository.getUsers(data)
    if(!usersList){
      throw new validationError(HttpStatusMessages.failedToRetrieveUsersList)
    }
    return {usersList,paginationData}
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
  
  public async updateBlockStatus(data:UpdateBlockStatusDTO):Promise<User | null>{
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
