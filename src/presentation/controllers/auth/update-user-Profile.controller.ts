import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, ProfileStatus } from "@shared/constants/index.constants";
import { UpdateUserDetailsDTO } from "@application/dtos/user-dtos";
import { UpdateUserProfileUseCase } from "@application/usecases/auth/update-user-profile.usecase";

export class UpdateUserProfileController {
  constructor(private updateUserProfileUseCase: UpdateUserProfileUseCase) {}

  async handleUpdateUserProfile(req: Request, res: Response): Promise<void> {
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
