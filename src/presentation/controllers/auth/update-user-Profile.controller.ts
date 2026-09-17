import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, ProfileStatus } from "@shared/constants/index.constants";
import { UpdateUserDetailsDTO } from "@application/dtos/user-dtos";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import { IUpdateUserProfileUC } from "@application/interfaces/usecases/IAuthUC";

@injectable()
export class UpdateUserProfileController {
  constructor(
    @inject(TYPES_AUTH_USECASES.UpdateUserProfileUseCase)
    private updateUserProfileUseCase: IUpdateUserProfileUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { userId, ...bodyWithoutUserId } = req.body;

    const userProfileData: UpdateUserDetailsDTO = {
      userId: req?.user?._id,
      ...bodyWithoutUserId,
    };

    const updatedUserData = await this.updateUserProfileUseCase.execute(
      userProfileData
    );

    sendResponse(res, StatusCodes.OK, updatedUserData, ProfileStatus.Updated);
  }
}
