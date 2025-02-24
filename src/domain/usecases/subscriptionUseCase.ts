import { CreateSubscriptionDTO, IdDTO } from "../../application/dtos";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { Subscription } from "../entities/subscriptionEntity";
import { subscriptionRepository } from "../interfaces/subscriptionRepository";

export class SubscriptionUseCase {

    constructor(private subscriptionRepository:subscriptionRepository) {}

    public async createSubscription(data:CreateSubscriptionDTO):Promise<Subscription> {

        const {trainerId,subPeriod,planType} = data
        const existing = await this.subscriptionRepository.findExistingSubscription({trainerId,subPeriod,planType})

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
}