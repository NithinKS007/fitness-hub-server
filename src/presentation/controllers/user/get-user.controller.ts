import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { UserStatus, StatusCodes } from "@shared/constants/index.constants";
import { parseQueryParams } from "@shared/utils/parse.queryParams";
import { GetUsersUseCase } from "@application/usecases/user/get-users.usecase";

export class GetUsersController {
  constructor(private getUsersUseCase: GetUsersUseCase) {}

  async handleGetUsers(req: Request, res: Response): Promise<void> {
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
