import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, TrainerStatus } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { GetTrainerChatListUseCase } from "@application/usecases/chat/get-trainer-chat-list.usecase";
import { TYPES_CHAT_USECASES } from "di/types-usecases";

@injectable()
export class GetTrainerContactsController {
  constructor(
    @inject(TYPES_CHAT_USECASES.GetTrainerChatListUseCase)
    private getTrainerChatListUseCase: GetTrainerChatListUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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
      TrainerStatus.ListRetrieved
    );
  }
}
