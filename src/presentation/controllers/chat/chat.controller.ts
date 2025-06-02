import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  ChatStatus,
  HttpStatusCodes,
  TrainerStatus,
  UserStatus,
} from "../../../shared/constants/index.constants";
import { ChatUseCase } from "../../../application/usecases/chat/chat.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class ChatController {
  constructor(private chatUseCase: ChatUseCase) {}
  async getMessages(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.params;
    const messages = await this.chatUseCase.getMessages({
      userId: senderId,
      otherUserId: receiverId,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      messages,
      ChatStatus.ChatSendSuccessfully
    );
  }

  async getTrainerChatList(req: Request, res: Response): Promise<void> {
    const trainerId = req?.user?._id;
    const { search } = parseQueryParams(req.query);
    const trainerChatList = await this.chatUseCase.getTrainerChatList(
      trainerId,
      {
        search: search,
      }
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      trainerChatList,
      TrainerStatus.TrainersList
    );
  }

  async getUserChatList(req: Request, res: Response): Promise<void> {
    const userId = req?.user?._id;
    const { search } = parseQueryParams(req.query);
    const userChatList = await this.chatUseCase.getUserChatList(userId, {
      search: search,
    });
    sendResponse(res, HttpStatusCodes.OK, userChatList, UserStatus.UserList);
  }
}
