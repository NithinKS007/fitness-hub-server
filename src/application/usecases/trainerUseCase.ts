import { GetTrainersApprovalQueryDTO, GetTrainersQueryDTO } from "../dtos/queryDTOs";
import { IdDTO } from "../dtos/utilityDTOs";
import { PaginationDTO } from "../dtos/utilityDTOs";
import { TrainerVerificationDTO } from "../dtos/trainerDTOs";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { Trainer } from "../../domain/entities/trainerEntity";
import { TrainerWithSubscription } from "../../domain/entities/trainerWithSubscription";
import { TrainerRepository } from "../../domain/interfaces/trainerRepository";

export class TrainerUseCase {
    constructor(private trainerRepository:TrainerRepository){}

    public async getTrainers(data:GetTrainersQueryDTO):Promise<{trainersList :Trainer[],paginationData:PaginationDTO}> {
        const {trainersList,paginationData} = await this.trainerRepository.getTrainers(data)
       return {
          trainersList,
          paginationData
       }
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
  public async getApprovalPendingList(data:GetTrainersApprovalQueryDTO):Promise<{trainersList:Trainer[],paginationData:PaginationDTO}>{

        if(data.fromDate){
          data.fromDate = new Date(data.fromDate) 
        }
        if(data.toDate){
          data.toDate = new Date(data.toDate)
        }
      const {trainersList, paginationData} = await this.trainerRepository.getApprovalPendingList(data)
      if(!trainersList){
         throw new validationError(HttpStatusMessages.FailedToRetrieveTrainersList)
      }
      return {
        trainersList,
        paginationData
      }
  }
  
  public async approveRejectTrainerVerification(data:TrainerVerificationDTO):Promise<Trainer | null>{
      
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