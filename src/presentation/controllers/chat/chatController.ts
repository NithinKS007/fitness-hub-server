import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  ChatStatus,
  HttpStatusCodes,
  TrainerStatus,
  UserStatus,
} from "../../../shared/constants/index-constants";
import { ChatUseCase } from "../../../application/usecases/chat/chatUseCase";

export class ChatController {
  constructor(private chatUseCase: ChatUseCase) {}
  public async getMessages(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.params;
    const messages = await this.chatUseCase.getMessages({
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

  public async getTrainerChatList(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { search } = req.query;
    const trainerChatList = await this.chatUseCase.getTrainerChatList(
      trainerId,
      {
        search: search as string,
      }
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      trainerChatList,
      TrainerStatus.TrainersList
    );
  }

  public async getUserChatList(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;
    const { search } = req.query;
    const userChatList = await this.chatUseCase.getUserChatList(userId, {
      search: search as string,
    });
    sendResponse(res, HttpStatusCodes.OK, userChatList, UserStatus.UserList);
  }
}
