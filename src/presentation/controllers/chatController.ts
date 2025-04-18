import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  ChatStatusMessage,
  HttpStatusCodes,
  TrainerStatusMessage,
  UserStatusMessage,
} from "../../shared/constants/httpResponseStructure";
import { ChatUseCase } from "../../application/usecases/chatUseCase";
import { MongoChatRepository } from "../../infrastructure/databases/repositories/chatRepository";
import { MongoUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/userSubscriptionRepository";
import { handleLogError } from "../../shared/utils/handleLog";
import { MongoConversationRepository } from "../../infrastructure/databases/repositories/conversationRepository";

//MONGO REPOSITORY INSTANCES
const mongoChatRepository = new MongoChatRepository();
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoConversationRepository = new MongoConversationRepository()

//USE CASE INSTANCES
const chatUseCase = new ChatUseCase(
  mongoChatRepository,
  mongoConversationRepository
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
      ChatStatusMessage.ChatSendSuccessfully
    );
  }

  static async getTrainerChatList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id
      const trainerChatList = await chatUseCase.getTrainerChatList(trainerId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        trainerChatList,
        TrainerStatusMessage.TrainersList
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
      const userId = req.user._id
      const userChatList = await chatUseCase.getUserChatList(userId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        userChatList,
        UserStatusMessage.UserList
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
