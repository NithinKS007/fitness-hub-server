import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { ChatStatus, StatusCodes } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { TYPES_CHAT_USECASES } from "@di/types-usecases";
import { IGetUserChatListUC } from "@application/interfaces/usecases/IChatUC";

@injectable()
export class GetUserContactsController {
  constructor(
    @inject(TYPES_CHAT_USECASES.GetUserChatListUseCase)
    private getUserChatListUseCase: IGetUserChatListUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: userId } = req?.user || {};

    const { search } = parseQueryParams(req.query);

    const userChatList = await this.getUserChatListUseCase.execute({
      userId,
      search,
    });

    sendResponse(res, StatusCodes.OK, userChatList, ChatStatus.UserContacts);
  }
}
