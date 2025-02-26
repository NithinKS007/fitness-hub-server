import { CreateSubscriptionDTO, IdDTO, updateBlockStatus, updateSubscriptionBlockStatus, updateSubscriptionDetails } from "../../application/dtos";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { Subscription } from "../entities/subscriptionEntity";
import { SubscriptionRepository } from "../interfaces/subscriptionRepository";

export class SubscriptionUseCase {

    constructor(private subscriptionRepository:SubscriptionRepository) {}

    public async createSubscription(data:CreateSubscriptionDTO):Promise<Subscription> {

        const {trainerId,subPeriod} = data
        const existing = await this.subscriptionRepository.findExistingSubscription({trainerId,subPeriod})

        if(existing){
            throw new validationError(HttpStatusMessages.SubscriptionAlreadyExists)
        }
        return await this.subscriptionRepository.createSubscription(data)
    }

    public async getTrainerSubscriptions(data:IdDTO):Promise<Subscription[]> {

        if(!data){
            throw new validationError(HttpStatusMessages.IdRequired)
        }

        
        return await this.subscriptionRepository.findAllSubscription(data)
    }

    public async updateSubscriptionBlockStatus(data:updateSubscriptionBlockStatus):Promise<Subscription>{
        if(!data){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        
        const subscriptionData = await this.subscriptionRepository.findSubscriptionById(data._id)
        
        if(!subscriptionData){
            throw new validationError(HttpStatusMessages.InvalidId)
        }

        const updatedSubscriptionData = await this.subscriptionRepository.updateBlockStatus(data)

        if(!updatedSubscriptionData){
            throw new validationError(HttpStatusMessages.FailedToUpdateBlockStatus)
        }

        return updatedSubscriptionData
    }
    public async editSubscription(data:updateSubscriptionDetails):Promise<Subscription>{

        const {trainerId,subPeriod} = data
        if(!data){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }

        const subscriptionData = await this.subscriptionRepository.findSubscriptionById(data._id)

        if(!subscriptionData){
            throw new validationError(HttpStatusMessages.InvalidId)
        }
        const existing = await this.subscriptionRepository.findExistingSubscription({trainerId,subPeriod})

        if(existing){
            throw new validationError(HttpStatusMessages.SubscriptionAlreadyExists)
        }
        const updatedSubscriptionData = await this.subscriptionRepository.editSubscription(data)

        if(!updatedSubscriptionData){
            throw new validationError(HttpStatusMessages.FailedToUpdateBlockStatus)
        }
        return updatedSubscriptionData
    }

    public async deleteSubscription(data:IdDTO):Promise<Subscription>{
        if(!data){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        const subscriptionData = await this.subscriptionRepository.findSubscriptionById(data)
        if(!subscriptionData){
            throw new validationError(HttpStatusMessages.InvalidId)
        }
        const deletedSubscription = await this.subscriptionRepository.deletedSubscription(data)

        if(!deletedSubscription){
            throw new validationError(HttpStatusMessages.FailedToDelete)
        }
        return deletedSubscription
    }

}