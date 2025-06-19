import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, ProfileStatus } from "@shared/constants/index.constants";
import { UpdateTrainerProfileUseCase } from "@application/usecases/auth/update-trainer-profile.usecase";
import { TYPES_AUTH_USECASES } from "di/types-usecases";

@injectable()
export class UpdateTrainerProfileController {
  constructor(
    @inject(TYPES_AUTH_USECASES.UpdateTrainerProfileUseCase)
    private updateTrainerProfileUseCase: UpdateTrainerProfileUseCase
  ) {}

  async handleUpdateTrainerProfile(req: Request, res: Response): Promise<void> {
    const { _id: trainerId } = req?.user || {};
    const trainerProfileData = {
      trainerId,
      ...req.body,
    };

    const updatedTrainerData = await this.updateTrainerProfileUseCase.execute(
      trainerProfileData
    );

    sendResponse(
      res,
      StatusCodes.OK,
      updatedTrainerData,
      ProfileStatus.Updated
    );
  }
}
