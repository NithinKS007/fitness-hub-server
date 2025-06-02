import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  BlockStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { UserUseCase } from "../../../application/usecases/user/user.usecase";

export class UpdateUserBlockStatusController {
  constructor(private userUseCase: UserUseCase) {}
  async updateBlockStatus(req: Request, res: Response): Promise<void> {
    const blockStatusData = {
      userId: req.params.userId,
      isBlocked: req.body.isBlocked,
    };
    const updatedData = await this.userUseCase.updateBlockStatus(
      blockStatusData
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      updatedData,
      BlockStatus.BlockStatusUpdated
    );
  }
}
