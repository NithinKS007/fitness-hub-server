import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { ChatStatus, StatusCodes } from "@shared/constants/index.constants";
import { GetChatHistoryUseCase } from "@application/usecases/chat/get-chat-history.usecase";
import { TYPES_CHAT_USECASES } from "@di/types-usecases";

@injectable()
export class GetChatsController {
  constructor(
    @inject(TYPES_CHAT_USECASES.GetChatHistoryUseCase)
    private getChatHistoryUseCase: GetChatHistoryUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.params;

    const messages = await this.getChatHistoryUseCase.execute({
      userId: senderId,
      otherUserId: receiverId,
    });

    sendResponse(res, StatusCodes.OK, messages, ChatStatus.ChatSend);
  }
}
