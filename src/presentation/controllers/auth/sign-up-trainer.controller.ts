import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { CreateTrainerUseCase } from "@application/usecases/auth/create-trainer.usecase";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";

@injectable()
export class SignUpTrainerController {
  constructor(
    @inject(TYPES_AUTH_USECASES.CreateTrainerUseCase)
    private createTrainerUseCase: CreateTrainerUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const createdTrainer = await this.createTrainerUseCase.execute(req.body);

    sendResponse(res, StatusCodes.OK, createdTrainer, AuthStatus.UserCreated);
  }
}
