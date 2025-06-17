import { Request, Response } from "express";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { CreateTrainerUseCase } from "@application/usecases/auth/create-trainer.usecase";

export class SignUpTrainerController {
  constructor(private createTrainerUseCase: CreateTrainerUseCase) {}

  async handleSignUpTrainer(req: Request, res: Response): Promise<void> {
    const createdTrainer = await this.createTrainerUseCase.execute(req.body);

    sendResponse(res, StatusCodes.OK, createdTrainer, AuthStatus.UserCreated);
  }
}
