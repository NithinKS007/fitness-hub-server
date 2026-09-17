import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, ProfileStatus } from "@shared/constants/index.constants";
import { UpdateUserDetailsDTO } from "@application/dtos/user-dtos";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import {
  IUpdateTRProfileUC,
  IUpdateUserProfileUC,
} from "@application/interfaces/usecases/IAuthUC";

@injectable()
export class UpdateProfileController {
  constructor(
    @inject(TYPES_AUTH_USECASES.UpdateUserProfileUseCase)
    private updateUserProfileUseCase: IUpdateUserProfileUC,
    @inject(TYPES_AUTH_USECASES.UpdateTrainerProfileUseCase)
    private updateTrainerProfileUseCase: IUpdateTRProfileUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { userId, ...bodyWithoutUserId } = req.body;

    const { role } = req?.user?.role;

    switch (role) {
      case "user":
        const userProfileData: UpdateUserDetailsDTO = {
          userId: req?.user?.id,
          ...bodyWithoutUserId,
        };

        const updatedUserData = await this.updateUserProfileUseCase.execute(
          userProfileData
        );

        sendResponse(res, StatusCodes.OK, updatedUserData, ProfileStatus.Updated);
        return;

      case "trainer":
        const trainerProfileData = {
          userId: req?.user?.id,
          ...req.body,
        };

        const updatedTrainerData = await this.updateTrainerProfileUseCase.execute(
          trainerProfileData
        );

        sendResponse(res, StatusCodes.OK, updatedTrainerData, ProfileStatus.Updated);
        return;
      default:
        sendResponse(res, StatusCodes.BadRequest, null, "Invalid user role");
        return;
    }
  }
}
