import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  HttpStatusCodes,
  ProfileStatus,
} from "../../../shared/constants/index.constants";
import { UpdateProfileUseCase } from "../../../application/usecases/auth/update-profile.usecase";
import { UpdateUserDetailsDTO } from "../../../application/dtos/user-dtos";

export class ProfileController {
  constructor(private profileUseCase: UpdateProfileUseCase) {}
  async updateTrainerProfile(req: Request, res: Response): Promise<void> {
    const trainerProfileData = {
      trainerId: req?.user?._id,
      ...req.body,
    };
    const updatedTrainerData = await this.profileUseCase.updateTrainerProfile(
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
    const updatedUserData = await this.profileUseCase.updateUserProfile(
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
