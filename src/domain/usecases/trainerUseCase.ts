import { IdDTO, trainerVerification } from "../../application/dtos";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { Trainer } from "../entities/trainerEntity";
import { TrainerWithSubscription } from "../entities/trainerWithSubscription";
import { TrainerRepository } from "../interfaces/trainerRepository";

export class TrainerUseCase {
    constructor(private trainerRepository:TrainerRepository){}

    public async getTrainers():Promise<Trainer[]> {
        const trainerSpecificData = await this.trainerRepository.getTrainers()
        return trainerSpecificData
    }

  public async getTrainerDetailsById(data:IdDTO):Promise<Trainer> {
        if(!data){
            throw new validationError(HttpStatusMessages.IdRequired)
        }
        const trainerDetails = await this.trainerRepository.getTrainerDetailsById(data)
        if(!trainerDetails){
          throw new validationError(HttpStatusMessages.FailedToRetrieveTrainerDetails)
        }
        return trainerDetails
  }
  public async getApprovalPendingList():Promise<Trainer[]>{
      const trainersList = await this.trainerRepository.getApprovalPendingList()
      if(!trainersList){
         throw new validationError(HttpStatusMessages.FailedToRetrieveTrainersList)
      }
      return trainersList
  }
  
  public async approveRejectTrainerVerification(data:trainerVerification):Promise<Trainer | null>{
      
    const { _id, action } = data
    if(!_id && !action){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.trainerRepository.approveRejectTrainerVerification({_id,action})
    }

  public async getApprovedTrainers(searchFilterQuery:any):Promise<Trainer []> {

    const trainersList = await this.trainerRepository.getApprovedTrainers(searchFilterQuery)
    if(!trainersList){
       throw new validationError(HttpStatusMessages.FailedToRetrieveTrainersList)
    }
    return trainersList
  }
  public async getApprovedTrainerDetailsWithSub(data:IdDTO):Promise<TrainerWithSubscription> {
    const trainerData = await this.trainerRepository.getApprovedTrainerDetailsWithSub(data)
    if(!trainerData){
       throw new validationError(HttpStatusMessages.FailedToRetrieveTrainerWithSubscription)
    }
    return trainerData
  }

}