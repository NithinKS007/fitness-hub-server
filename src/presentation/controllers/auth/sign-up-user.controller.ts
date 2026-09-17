import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import { ICreateUserUC } from "@application/interfaces/usecases/IAuthUC";

@injectable()
export class SignUpUserController {
  constructor(
    @inject(TYPES_AUTH_USECASES.CreateUserUseCase)
    private createUserUseCase: ICreateUserUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const createdUser = await this.createUserUseCase.execute(req.body);

    sendResponse(res, StatusCodes.Created, createdUser, AuthStatus.UserCreated);
  }
}
