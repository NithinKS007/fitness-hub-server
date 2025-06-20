import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, UserStatus } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { GetUserChatListUseCase } from "@application/usecases/chat/get-user-chat-list.usecase";
import { TYPES_CHAT_USECASES } from "di/types-usecases";

@injectable()
export class GetUserContactsController {
  constructor(
    @inject(TYPES_CHAT_USECASES.GetUserChatListUseCase)
    private getUserChatListUseCase: GetUserChatListUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const { search } = parseQueryParams(req.query);

    const userChatList = await this.getUserChatListUseCase.execute(userId, {
      search: search,
    });

    sendResponse(res, StatusCodes.OK, userChatList, UserStatus.UserList);
  }
}
