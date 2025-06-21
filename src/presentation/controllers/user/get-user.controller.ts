import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { UserStatus, StatusCodes } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { GetUsersUseCase } from "@application/usecases/user/get-users.usecase";
import { TYPES_USER_USECASES } from "@di/types-usecases";

@injectable()
export class GetUsersController {
  constructor(
    @inject(TYPES_USER_USECASES.GetUsersUseCase)
    private getUsersUseCase: GetUsersUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { usersList, paginationData } = await this.getUsersUseCase.execute(
      parseQueryParams(req.query)
    );

    sendResponse(
      res,
      StatusCodes.OK,
      { usersList: usersList, paginationData: paginationData },
      UserStatus.UserList
    );
  }
}
