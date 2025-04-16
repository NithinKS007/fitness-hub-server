import { CreateChatDTO,FindChatDTO } from "../../application/dtos/chatDTOs";
import { IdDTO } from "../../application/dtos/utilityDTOs";
import { Chat } from "../entities/chatEntity";

export interface IChatRepository {
    saveChat(createChat:CreateChatDTO): Promise<Chat>;
    getMessagesBetween2users(findChatDetails:FindChatDTO): Promise<Chat[]>;
    markAsRead(senderId:IdDTO,markAsRead:IdDTO):Promise<Chat[] | null>
}