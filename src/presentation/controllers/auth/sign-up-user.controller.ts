import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { CreateUserUseCase } from "@application/usecases/auth/create-user.usecase";

export class SignUpUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handleSignUpUser(req: Request, res: Response): Promise<void> {
    const createdUser = await this.createUserUseCase.execute(req.body);

    sendResponse(res, StatusCodes.OK, createdUser, AuthStatus.UserCreated);
  }
}
