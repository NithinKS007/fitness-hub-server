import { CreateTrainerSpecificDTO, IdDTO,TrainerSpecificDTO, trainerVerification} from "../../application/dtos";
import { Trainer, TrainerSpecific } from "../entities/trainerEntity";
import { TrainerWithSubscription } from "../entities/trainerWithSubscription";

export interface TrainerRepository {
  create(data: CreateTrainerSpecificDTO): Promise<TrainerSpecific>;
  getTrainerDetailsById(data:IdDTO):Promise<Trainer>
  updateTrainerSpecificData(data:TrainerSpecificDTO):Promise<TrainerSpecific| null>
  getTrainers():Promise<Trainer[]>
  getTrainerDetailsByUserIdRef(data:IdDTO):Promise<Trainer>
  approveRejectTrainerVerification(data:trainerVerification):Promise<Trainer | null>
  getApprovedTrainers(searchFilterQuery:any):Promise<Trainer[]>
  getApprovedTrainerDetailsWithSub(data:IdDTO):Promise<TrainerWithSubscription>
  getApprovalPendingList():Promise<Trainer[]>
}
