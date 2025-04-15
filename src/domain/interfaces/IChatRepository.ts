import { CreateChatDTO,FindChatDTO } from "../../application/dtos/chatDTOs";
import { Chat } from "../entities/chatEntity";

export interface IChatRepository {
    saveChat(createChat:CreateChatDTO): Promise<Chat>;
    getMessagesBetween2users(findChatDetails:FindChatDTO): Promise<Chat[]>;
}