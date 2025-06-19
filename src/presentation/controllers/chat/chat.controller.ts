import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  ChatStatus,
  StatusCodes,
  TrainerStatus,
  UserStatus,
} from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { GetChatHistoryUseCase } from "@application/usecases/chat/get-chat-history.usecase";
import { GetTrainerChatListUseCase } from "@application/usecases/chat/get-trainer-chat-list.usecase";
import { GetUserChatListUseCase } from "@application/usecases/chat/get-user-chat-list.usecase";
import { TYPES_CHAT_USECASES } from "di/types-usecases";

@injectable()
export class ChatController {
  constructor(
    @inject(TYPES_CHAT_USECASES.GetChatHistoryUseCase)
    private getChatHistoryUseCase: GetChatHistoryUseCase,

    @inject(TYPES_CHAT_USECASES.GetTrainerChatListUseCase)
    private getTrainerChatListUseCase: GetTrainerChatListUseCase,

    @inject(TYPES_CHAT_USECASES.GetUserChatListUseCase)
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
      StatusCodes.OK,
      messages,
      ChatStatus.ChatSendSuccessfully
    );
  }

  async getTrainerChatList(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};

    const { search } = parseQueryParams(req.query);

    const trainerChatList = await this.getTrainerChatListUseCase.execute(
      trainerId,
      { search: search }
    );

    sendResponse(
      res,
      StatusCodes.OK,
      trainerChatList,
      TrainerStatus.TrainersList
    );
  }

  async getUserChatList(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const { search } = parseQueryParams(req.query);

    const userChatList = await this.getUserChatListUseCase.execute(userId, {
      search: search,
    });

    sendResponse(res, StatusCodes.OK, userChatList, UserStatus.UserList);
  }
}
