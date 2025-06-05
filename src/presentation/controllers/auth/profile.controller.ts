import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  ProfileStatus,
} from "../../../shared/constants/index.constants";
import { UpdateTrainerProfileUseCase } from "../../../application/usecases/auth/update-trainer-profile.usecase";
import { UpdateUserDetailsDTO } from "../../../application/dtos/user-dtos";
import { UpdateUserProfileUseCase } from "../../../application/usecases/auth/update-user-profile.usecase";

export class ProfileController {
  constructor(
    private updateTrainerProfileUseCase: UpdateTrainerProfileUseCase,
    private updateUserProfileUseCase: UpdateUserProfileUseCase
  ) {}
  async updateTrainerProfile(req: Request, res: Response): Promise<void> {
    const trainerProfileData = {
      trainerId: req?.user?._id,
      ...req.body,
    };
    const updatedTrainerData = await this.updateTrainerProfileUseCase.execute(
      trainerProfileData
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      updatedTrainerData,
      ProfileStatus.UserDetailsUpdated
    );
  }
  async updateUserProfile(req: Request, res: Response): Promise<void> {
    const { userId, ...bodyWithoutUserId } = req.body;
    const userProfileData: UpdateUserDetailsDTO = {
      userId: req?.user?._id,
      ...bodyWithoutUserId,
    };
    const updatedUserData = await this.updateUserProfileUseCase.execute(
      userProfileData
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      updatedUserData,
      ProfileStatus.UserDetailsUpdated
    );
  }
}
