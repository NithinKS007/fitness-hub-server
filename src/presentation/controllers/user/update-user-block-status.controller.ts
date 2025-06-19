import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { BlockStatus, StatusCodes } from "@shared/constants/index.constants";
import { UpdateUserBlockStatusUseCase } from "@application/usecases/user/update-user-block-status.usecase";
import { TYPES_USER_USECASES } from "di/types-usecases";

@injectable()
export class UpdateUserBlockStatusController {
  constructor(
    @inject(TYPES_USER_USECASES.UpdateUserBlockStatusUseCase)
    private updateUserBlockStatusUseCase: UpdateUserBlockStatusUseCase
  ) {}

  async updateBlockStatus(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const blockStatusData = {
      userId,
      isBlocked,
    };

    const updatedData = await this.updateUserBlockStatusUseCase.execute(
      blockStatusData
    );

    sendResponse(
      res,
      StatusCodes.OK,
      updatedData,
      BlockStatus.StatusUpdateFailed
    );
  }
}
