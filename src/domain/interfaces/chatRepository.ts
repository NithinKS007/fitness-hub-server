import { CreateChatDTO,FindChatDTO } from "../../application/dtos/chatDTOs";
import { Chat } from "../entities/chatEntity";

export interface ChatRepository {
    saveChat(date:CreateChatDTO): Promise<Chat>;
    getMessagesBetween2users(data:FindChatDTO): Promise<Chat[]>;
}