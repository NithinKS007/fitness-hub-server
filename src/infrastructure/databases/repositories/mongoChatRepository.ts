import { CreateChatDTO,FindChatDTO } from "../../../application/dtos/chatDTOs";
import { Chat } from "../../../domain/entities/chatEntity";
import { ChatRepository } from "../../../domain/interfaces/chatRepository";
import chatModel from "../models/chatModel";

export class MongoChatRepository implements ChatRepository{
    public async saveChat(data: CreateChatDTO): Promise<Chat> {
        return await chatModel.create(data)
    }
    public async getMessagesBetween2users(data:FindChatDTO): Promise<Chat[]> {

        const {  userId, otherUserId} = data
        const chats = await chatModel.find({
            $or:[
                {senderId:userId,receiverId:otherUserId},
                {senderId:otherUserId,receiverId:userId},
            ]
        }).sort({createdAt:1})

        return chats
    }
}