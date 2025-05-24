import { Request, Response } from "express";
import { sendResponse } from "../../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  TrainerStatus,
} from "../../../shared/constants/index-constants";
import { TrainerUseCase } from "../../../application/usecases/trainer/trainerUseCase";
import { MongoTrainerRepository } from "../../../infrastructure/databases/repositories/trainerRepository";
import { GetUserSubscriptionUseCase } from "../../../application/usecases/subscription/getUserSubscriptionUseCase";
import { MongoUserSubscriptionPlanRepository } from "../../../infrastructure/databases/repositories/userSubscriptionRepository";
import { StripePaymentService } from "../../../infrastructure/services/payments/stripeServices";

//MONGO REPOSITORY INSTANCES
const monogUserSubscriptionPlanRepository =
  new MongoUserSubscriptionPlanRepository();
const mongoTrainerRepository = new MongoTrainerRepository();

//SERVICE INSTANCES
const stripeService = new StripePaymentService();

//USE CASE INSTANCES
const trainerUseCase = new TrainerUseCase(mongoTrainerRepository);
const getUserSubscriptionUseCase = new GetUserSubscriptionUseCase(
  monogUserSubscriptionPlanRepository,
  stripeService
);

export class TrainerDisplayController {
  static async getApprovedTrainers(req: Request, res: Response): Promise<void> {
    const { page, limit, Search, Specialization, Experience, Gender, sort } =
      req.query;

    const { trainersList, paginationData } =
      await trainerUseCase.getApprovedTrainers({
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

  static async getApprovedTrainerDetailsWithSub(
    req: Request,
    res: Response
  ): Promise<void> {
    const trainerId = req.params.trainerId;
    const trainersData = await trainerUseCase.getApprovedTrainerDetailsWithSub(
      trainerId
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      trainersData,
      TrainerStatus.TrainersList
    );
  }

  static async getMyTrainers(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;
    const { page, limit, search } = req.query;
    const { userTrainersList, paginationData } =
      await getUserSubscriptionUseCase.userMyTrainersList(userId, {
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
