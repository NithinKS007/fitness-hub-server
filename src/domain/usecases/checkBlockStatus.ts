import { IdDTO } from "../../application/dtos";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { UserRepository } from "../interfaces/userRepository";

export class CheckBlockStatus {
  constructor(private userRepository: UserRepository) {}

  public async checkBlockStatus(_id:IdDTO):Promise<boolean> {
     if(!_id){
        throw new Error(HttpStatusMessages.IdRequired)
     }
     const userData = await this.userRepository.findUserById(_id)
     if(!userData){
        throw new Error(HttpStatusMessages.InvalidId)
     }
     return userData.isBlocked
  }
}
