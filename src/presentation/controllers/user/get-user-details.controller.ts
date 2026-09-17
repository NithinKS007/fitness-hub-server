import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { ProfileStatus, StatusCodes } from "@shared/constants/index.constants";
import { TYPES_USER_USECASES } from "@di/types-usecases";
import { IGetUserDetailsUC } from "@application/interfaces/usecases/IUserUC";

@injectable()
export class GetUserDetailsController {
  constructor(
    @inject(TYPES_USER_USECASES.GetUserDetailsUseCase)
    private getUserDetailsUseCase: IGetUserDetailsUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id: userId } = req.params;

    const userData = await this.getUserDetailsUseCase.execute(userId);

    sendResponse(res, StatusCodes.OK, userData, ProfileStatus.UserRetrieved);
  }
}
