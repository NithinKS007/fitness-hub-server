import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/http.response";
import {
  AuthStatus,
  HttpStatusCodes,
} from "../../../shared/constants/index.constants";
import { CreateUserUseCase } from "../../../application/usecases/auth/create-user.usecase";
import { CreateTrainerUseCase } from "../../../application/usecases/auth/create-trainer.usecase";

export class CreateController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private createTrainerUseCase: CreateTrainerUseCase
  ) {}
  async signUpUser(req: Request, res: Response): Promise<void> {
    const createdUser = await this.createUserUseCase.execute(req.body);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      createdUser,
      AuthStatus.UserCreatedSuccessfully
    );
  }
  async signUpTrainer(req: Request, res: Response): Promise<void> {
    const createdTrainer = await this.createTrainerUseCase.execute(req.body);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      createdTrainer,
      AuthStatus.UserCreatedSuccessfully
    );
  }
}
