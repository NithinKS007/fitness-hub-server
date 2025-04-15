import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { ChatUseCase } from "../../application/usecases/chatUseCase";
import { MongoChatRepository } from "../../infrastructure/databases/repositories/chatRepository";
import { MongoUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/userSubscriptionRepository";
import logger from "../../infrastructure/logger/logger";
import { handleLogError } from "../../shared/utils/handleLogError";

//MONGO REPOSITORY INSTANCES
const mongoChatRepository = new MongoChatRepository();
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();

//USE CASE INSTANCES
const chatUseCase = new ChatUseCase(
  mongoChatRepository,
  monogUserSubscriptionPlanRepository
);

export class ChatController {
  static async getMessages(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.params;
    const messages = await chatUseCase.getMessages({
      userId: senderId as string,
      otherUserId: receiverId as string,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      messages,
      HttpStatusMessages.ChatsSendSuccessfully
    );
  }

  static async getTrainerChatList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { _id } = req.user;
      const trainerChatList = await chatUseCase.getTrainerChatList(_id);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        trainerChatList,
        HttpStatusMessages.TrainersList
      );
    } catch (error) {
      handleLogError(
        error,
        "ChatController.getTrainerChatList",
        "Error fetching trainer chat list"
      );
      next(error);
    }
  }

  static async getUserChatList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { _id } = req.user;
      const userChatList = await chatUseCase.getUserChatList(_id);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        userChatList,
        HttpStatusMessages.UserList
      );
    } catch (error) {
      handleLogError(
        error,
        "ChatController.getUserChatList",
        "Error fetching user chat list"
      );
      next(error);
    }
  }
}
