import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { ProfileStatus, StatusCodes } from "@shared/constants/index.constants";
import { GetUserDetailsUseCase } from "@application/usecases/user/get-user-details.usecase";

export class GetUserDetailsController {
  constructor(private getUserDetailsUseCase: GetUserDetailsUseCase) {}

  async handleGetUserDetails(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;

    const userData = await this.getUserDetailsUseCase.execute(userId);

    sendResponse(res, StatusCodes.OK, userData, ProfileStatus.UserRetrieved);
  }
}
