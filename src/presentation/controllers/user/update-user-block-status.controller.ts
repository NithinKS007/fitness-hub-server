import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { BlockStatus, StatusCodes } from "@shared/constants/index.constants";
import { TYPES_USER_USECASES } from "@di/types-usecases";
import { IUpdateUserBlockStatusUC } from "@application/interfaces/usecases/IUserUC";

@injectable()
export class UpdateUserBlockStatusController {
  constructor(
    @inject(TYPES_USER_USECASES.UpdateUserBlockStatusUseCase)
    private updateUserBlockStatusUseCase: IUpdateUserBlockStatusUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: userId } = req.params;
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
