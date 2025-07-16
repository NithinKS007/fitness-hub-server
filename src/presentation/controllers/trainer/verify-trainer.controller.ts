import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { TrainerStatus, StatusCodes } from "@shared/constants/index.constants";
import { TYPES_TRAINER_USECASES } from "@di/types-usecases";
import { ITrainerApprovalUC } from "@application/interfaces/usecases/ITrainerUC";

@injectable()
export class VerifyTrainerController {
  constructor(
    @inject(TYPES_TRAINER_USECASES.TrainerApprovalUseCase)
    private trainerApprovalUseCase: ITrainerApprovalUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: trainerId } = req.params;
    const { action } = req.body;

    const verificationData = {
      trainerId,
      action,
    };

    const updatedTrainerData = await this.trainerApprovalUseCase.execute(
      verificationData
    );

    sendResponse(
      res,
      StatusCodes.OK,
      updatedTrainerData,
      req.body.action === "approved"
        ? TrainerStatus.Approved
        : TrainerStatus.Rejected
    );
  }
}
