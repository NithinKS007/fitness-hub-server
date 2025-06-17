import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { TrainerStatus, StatusCodes } from "@shared/constants/index.constants";
import { TrainerApprovalUseCase } from "@application/usecases/trainer/trainer-approval.usecase";

export class VerifyTrainerController {
  constructor(private trainerApprovalUseCase: TrainerApprovalUseCase) {}

  async handleVerification(req: Request, res: Response): Promise<void> {
    const { trainerId } = req.params;
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
        ? TrainerStatus.TrainerApproved
        : TrainerStatus.TrainerRejected
    );
  }
}
