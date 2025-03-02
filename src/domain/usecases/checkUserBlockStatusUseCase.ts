import { IdDTO } from "../../application/dtos";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { TrainerRepository } from "../interfaces/trainerRepository";
import { UserRepository } from "../interfaces/userRepository";

export class CheckUserBlockStatus {
  constructor(private userRepository: UserRepository) {}

  public async checkUserBlockStatus(_id: IdDTO): Promise<boolean> {
    if (!_id) {
      throw new validationError(HttpStatusMessages.IdRequired);
    }
    const userData = await this.userRepository.findById(_id);
    if (!userData) {
      throw new validationError(HttpStatusMessages.InvalidId);
    }
    return userData.isBlocked;
  }
}
