import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, ProfileStatus } from "@shared/constants/index.constants";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import { IUpdateTRProfileUC } from "@application/interfaces/usecases/IAuthUC";

@injectable()
export class UpdateTrainerProfileController {
  constructor(
    @inject(TYPES_AUTH_USECASES.UpdateTrainerProfileUseCase)
    private updateTrainerProfileUseCase: IUpdateTRProfileUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
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
