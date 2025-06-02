import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  ProfileStatus,
  UserStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { UserUseCase } from "../../../application/usecases/user/user.usecase";
import { parseQueryParams } from "../../../shared/utils/parse.queryParams";

export class GetUserController {
  constructor(private userUseCase: UserUseCase) {}
  async getUsers(req: Request, res: Response): Promise<void> {
    const { usersList, paginationData } = await this.userUseCase.getUsers(
      parseQueryParams(req.query)
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { usersList: usersList, paginationData: paginationData },
      UserStatus.UserList
    );
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    const userData = await this.userUseCase.getUserDetails(userId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      userData,
      ProfileStatus.UserDataRetrieved
    );
  }
}
