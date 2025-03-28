import { Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { ChatUseCase } from "../../application/usecases/chatUseCase";
import { MongoChatRepository } from "../../infrastructure/databases/repositories/mongoChatRepository";

//MONGO REPOSITORY INSTANCES
const mongoChatRepository = new MongoChatRepository();

//USE CASE INSTANCES
const chatUseCase = new ChatUseCase(mongoChatRepository);

export class ChatController {
  static async getMessages(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.params;
    const messages = await chatUseCase.getMessages({userId: senderId as string,otherUserId: receiverId as string});
    sendResponse(res,HttpStatusCodes.OK,messages,HttpStatusMessages.ChatsSendSuccessfully);
  }
}
