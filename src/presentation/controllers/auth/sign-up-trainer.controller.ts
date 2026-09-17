import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import { ICreateTrainerUC } from "@application/interfaces/usecases/IAuthUC";

@injectable()
export class SignUpTrainerController {
  constructor(
    @inject(TYPES_AUTH_USECASES.CreateTrainerUseCase)
    private createTrainerUseCase: ICreateTrainerUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const createdTrainer = 
    await this.createTrainerUseCase.execute(req.body);

    sendResponse(res, StatusCodes.Created, createdTrainer, AuthStatus.UserCreated);
  }
}
