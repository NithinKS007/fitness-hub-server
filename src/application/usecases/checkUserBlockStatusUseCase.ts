import { IdDTO } from "../dtos/utilityDTOs";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { ITrainerRepository } from "../../domain/interfaces/ITrainerRepository";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";

export class CheckUserBlockStatus {
  constructor(
    private userRepository: IUserRepository,
    private trainerRepository: ITrainerRepository
  ) {}

  public async checkUserBlockStatus(_id: IdDTO): Promise<boolean> {
    if (!_id) {
      throw new validationError(HttpStatusMessages.IdRequired);
    }
    const userData = await this.userRepository.findById(_id);
    const trainerData = await this.trainerRepository.getTrainerDetailsById(
      _id.toString()
    );
    if (!userData && !trainerData) {
      throw new validationError(HttpStatusMessages.InvalidId);
    }

    if (userData) return userData.isBlocked;
    if (trainerData) return trainerData.isBlocked;
    return false;
  }
}
