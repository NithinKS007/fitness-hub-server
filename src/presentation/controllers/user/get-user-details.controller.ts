import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { ProfileStatus, StatusCodes } from "@shared/constants/index.constants";
import { GetUserDetailsUseCase } from "@application/usecases/user/get-user-details.usecase";
import { TYPES_USER_USECASES } from "di/types-usecases";

@injectable()
export class GetUserDetailsController {
  constructor(
    @inject(TYPES_USER_USECASES.GetUserDetailsUseCase)
    private getUserDetailsUseCase: GetUserDetailsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    const userData = await this.getUserDetailsUseCase.execute(userId);

    sendResponse(res, StatusCodes.OK, userData, ProfileStatus.UserRetrieved);
  }
}
