import { Chat } from "../../domain/entities/chatEntity";
import { ChatRepository } from "../../domain/interfaces/chatRepository";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { CreateChatDTO,FindChatDTO } from "../dtos/chatDTOs";

export class ChatUseCase {
    constructor(private chatRepository:ChatRepository){}
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
}
