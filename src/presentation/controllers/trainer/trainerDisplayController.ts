import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  TrainerStatus,
} from "../../../shared/constants/index-constants";
import { TrainerGetUseCase } from "../../../application/usecases/trainer/trainerGetUseCase";
import { GetUserSubscriptionUseCase } from "../../../application/usecases/subscription/getUserSubscriptionUseCase";

export class TrainerDisplayController {
  constructor(
    private trainerGetUseCase: TrainerGetUseCase,
    private getUserSubscriptionUseCase: GetUserSubscriptionUseCase
  ) {}

  public async getApprovedTrainers(req: Request, res: Response): Promise<void> {
    const { page, limit, Search, Specialization, Experience, Gender, sort } =
      req.query;

    const { trainersList, paginationData } =
      await this.trainerGetUseCase.getApprovedTrainers({
        page: page as string,
        limit: limit as string,
        Search: Search as string,
        Specialization: Specialization as string[],
        Experience: Experience as string[],
        Gender: Gender as string[],
        Sort: sort as string,
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { trainersList, paginationData },
      TrainerStatus.TrainersList
    );
  }

  public async getApprovedTrainerDetailsWithSub(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.params.trainerId;
    const trainersData =
      await this.trainerGetUseCase.getApprovedTrainerDetailsWithSub(trainerId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      trainersData,
      TrainerStatus.TrainersList
    );
  }

  public async getMyTrainers(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;
    const { page, limit, search } = req.query;
    const { userTrainersList, paginationData } =
      await this.getUserSubscriptionUseCase.userMyTrainersList(userId, {
        page: page as string,
        search: search as string,
        limit: limit as string,
      });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { userTrainersList, paginationData },
      TrainerStatus.TrainersListRetrieved
    );
  }
}
