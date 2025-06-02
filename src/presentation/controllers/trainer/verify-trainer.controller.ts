import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  TrainerStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { TrainerApprovalUseCase } from "../../../application/usecases/trainer/trainer-approval.usecase";

export class VerifyTrainerController {
  constructor(private trainerApprovalUseCase: TrainerApprovalUseCase) {}
  async handleVerification(req: Request, res: Response): Promise<void> {
    const verificationData = {
      trainerId: req.params.trainerId,
      action: req.body.action,
    };
    const updatedTrainerData =
      await this.trainerApprovalUseCase.handleVerification(verificationData);
    if (req.body.action === "approved") {
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedTrainerData,
        TrainerStatus.TrainerApproved
      );
    } else {
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedTrainerData,
        TrainerStatus.TrainerRejected
      );
    }
  }
}
