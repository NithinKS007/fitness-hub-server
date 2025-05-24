import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  ChatStatus,
  HttpStatusCodes,
  TrainerStatus,
  UserStatus,
} from "../../../shared/constants/index-constants";
import { ChatUseCase } from "../../../application/usecases/chat/chatUseCase";
import { MongoChatRepository } from "../../../infrastructure/databases/repositories/chatRepository";
import { MongoConversationRepository } from "../../../infrastructure/databases/repositories/conversationRepository";

//MONGO REPOSITORY INSTANCES
const mongoChatRepository = new MongoChatRepository();
const mongoConversationRepository = new MongoConversationRepository();

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
      ChatStatus.ChatSendSuccessfully
    );
  }

  static async getTrainerChatList(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { search } = req.query;
    const trainerChatList = await chatUseCase.getTrainerChatList(trainerId, {
      search: search as string,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      trainerChatList,
      TrainerStatus.TrainersList
    );
  }

  static async getUserChatList(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;
    const { search } = req.query;
    const userChatList = await chatUseCase.getUserChatList(userId, {
      search: search as string,
    });
    sendResponse(res, HttpStatusCodes.OK, userChatList, UserStatus.UserList);
  }
}
