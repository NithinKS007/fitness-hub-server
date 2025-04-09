import { Chat } from "../../domain/entities/chatEntity";
import { MongoUserSubscriptionsList, MonogoTrainerSubscribersList, TrainerSubscribersList, UserSubscriptionsList } from "../../domain/entities/subscriptionEntity";
import { ChatRepository } from "../../domain/interfaces/chatRepository";
import { UserSubscriptionPlanRepository } from "../../domain/interfaces/userSubscriptionRepository";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { CreateChatDTO,FindChatDTO } from "../dtos/chatDTOs";
import { IdDTO } from "../dtos/utilityDTOs";
import stripe from "../../infrastructure/config/stripeConfig";

export class ChatUseCase {
    constructor(private chatRepository:ChatRepository,private userSubscriptionPlanRepository:UserSubscriptionPlanRepository){}
    public async sendMessageAndSave(data:CreateChatDTO):Promise<Chat>{
       const createdMessage =  await this.chatRepository.saveChat(data)
       if(!createdMessage){
        throw new validationError(HttpStatusMessages.FailedToCreateMessageInChatDatabase)
       }
       return createdMessage
    }

    public async getMessages(data:FindChatDTO):Promise<Chat[]>{
        const chatData = await this.chatRepository.getMessagesBetween2users(data)
        if(!chatData){
            throw new validationError(HttpStatusMessages.FailedToGetChatMessages)
        }
        return chatData
    }

    public async getTrainerChatList(trainerId:IdDTO):Promise<MonogoTrainerSubscribersList[]> {
        if(!trainerId){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        const trainerChatList = await this.userSubscriptionPlanRepository.findTrainerChatList(trainerId)
        if(!trainerChatList){
            throw new validationError(HttpStatusMessages.FailedToRetrieveChatList)
        }
          return trainerChatList
    }

    public async getUserChatList(userId:IdDTO):Promise<MongoUserSubscriptionsList[]> {
        if(!userId){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        const usersChatList = await this.userSubscriptionPlanRepository.findUserChatList(userId)
        if(!usersChatList){
            throw new validationError(HttpStatusMessages.FailedToRetrieveChatList)
        }
        return usersChatList
    }


}
