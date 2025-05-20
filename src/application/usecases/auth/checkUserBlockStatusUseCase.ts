import { IdDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthStatus} from "../../../shared/constants/index-constants";
import { ITrainerRepository } from "../../../domain/interfaces/ITrainerRepository";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export class CheckUserBlockStatus {
  constructor(
    private userRepository: IUserRepository,
    private trainerRepository: ITrainerRepository
  ) {}

  public async checkUserBlockStatus(_id: IdDTO): Promise<boolean> {
    if (!_id) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const userData = await this.userRepository.findById(_id);
    const trainerData = await this.trainerRepository.getTrainerDetailsById(
      _id.toString()
    );
    if (!userData && !trainerData) {
      throw new validationError(AuthStatus.InvalidId);
    }

    if (userData) return userData.isBlocked;
    if (trainerData) return trainerData.isBlocked;
    return false;
  }
}
