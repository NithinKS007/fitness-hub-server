import { NextFunction,Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { ChatUseCase } from "../../application/usecases/chatUseCase";
import { MongoChatRepository } from "../../infrastructure/databases/repositories/chatRepository";
import { MongoUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/userSubscriptionRepository";

//MONGO REPOSITORY INSTANCES
const mongoChatRepository = new MongoChatRepository();
const monogUserSubscriptionPlanRepository = new MongoUserSubscriptionPlanRepository()

//USE CASE INSTANCES
const chatUseCase = new ChatUseCase(mongoChatRepository,monogUserSubscriptionPlanRepository);

export class ChatController {
  static async getMessages(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.params;
    const messages = await chatUseCase.getMessages({userId: senderId as string,otherUserId: receiverId as string});
    sendResponse(res,HttpStatusCodes.OK,messages,HttpStatusMessages.ChatsSendSuccessfully);
  }

  static async getTrainerChatList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { _id } = req.user
      const trainerChatList = await chatUseCase.getTrainerChatList(_id);
      sendResponse(res, HttpStatusCodes.OK, trainerChatList, HttpStatusMessages.TrainersList);
    } catch (error: any) {
      console.error(`Error fetching trainer chat list: ${error}`);
      next(error);
    }
  }

  static async getUserChatList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { _id } = req.user
      const userChatList = await chatUseCase.getUserChatList(_id);
      sendResponse(res, HttpStatusCodes.OK, userChatList, HttpStatusMessages.UserList);
    } catch (error: any) {
      console.error(`Error fetching user chat list: ${error}`);
      next(error);
    }
  }
}
