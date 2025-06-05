import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  ChatStatus,
  HttpStatusCodes,
  TrainerStatus,
  UserStatus,
} from "../../../shared/constants/index.constants";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";
import { GetChatHistoryUseCase } from "../../../application/usecases/chat/get-chat-history.usecase";
import { GetTrainerChatListUseCase } from "../../../application/usecases/chat/get-trainer-chat-list.usecase";
import { GetUserChatListUseCase } from "../../../application/usecases/chat/get-user-chat-list.usecase";

export class ChatController {
  constructor(
    private getChatHistoryUseCase: GetChatHistoryUseCase,
    private getTrainerChatListUseCase: GetTrainerChatListUseCase,
    private getUserChatListUseCase: GetUserChatListUseCase
  ) {}
  async getMessages(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.params;
    const messages = await this.getChatHistoryUseCase.execute({
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
    const trainerChatList = await this.getTrainerChatListUseCase.execute(
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
    const userChatList = await this.getUserChatListUseCase.execute(userId, {
      search: search,
    });
    sendResponse(res, HttpStatusCodes.OK, userChatList, UserStatus.UserList);
  }
}
