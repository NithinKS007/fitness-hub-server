import { Request, Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { UserUseCase } from "../../domain/usecases/userUseCase";

const mongouserRepository = new MongoUserRepository();
const user = new UserUseCase(mongouserRepository);

export class AdminController {
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const usersData = await user.getUsers(req?.query?.role as string);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        usersData,
        HttpStatusMessages.UserList
      );
    } catch (error: any) {
      console.log(`Error in  getUsers : ${error}`);
      sendResponse(
        res,
        HttpStatusCodes.InternalServerError,
        null,
        HttpStatusMessages.failedToRetrieveUsersList
      );
    }
  }
  static async updateBlockStatus(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.params;
      const { isBlocked } = req.body;
      console.log(isBlocked);
      const userData = await user.updateBlockStatus({ _id, isBlocked });
      console.log("mani", userData);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        userData,
        HttpStatusMessages.BlockStatusUpdated
      );
    } catch (error: any) {
      console.log(`Error in  failed to update block status : ${error}`);
      if (error.message === HttpStatusMessages.FailedToUpdateBlockStatus) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.FailedToUpdateBlockStatus
        );
      } else if (error.message === HttpStatusMessages.AllFieldsAreRequired) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.AllFieldsAreRequired
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.FailedToUpdateBlockStatus
        );
      }
    }
  }
  static async trainerVerification(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.params;
      const { action } = req.body;
      const updatedTrainerData = await user.trainerVerification({
        _id,
        action,
      });
      if (action === "approved") {
        sendResponse(
          res,
          HttpStatusCodes.OK,
          updatedTrainerData,
          HttpStatusMessages.TrainerApproved
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.OK,
          updatedTrainerData,
          HttpStatusMessages.TrainerRejected
        );
      }
    } catch (error: any) {
      console.log(`Error to verify trainer : ${error}`);
      if (error.message === HttpStatusMessages.AllFieldsAreRequired) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.AllFieldsAreRequired
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.InternalServerError
        );
      }
    }
  }
  static async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      console.log("req.params", req.params._id);
      const userData = await user.getUserDetails(req.params._id);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        userData,
        HttpStatusMessages.UserDataRetrieved
      );
    } catch (error: any) {
      if (error.message === HttpStatusMessages.FailedToRetrieveUserDetails) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.FailedToRetrieveUserDetails
        );
      } else if (error.message === HttpStatusMessages.IdRequired) {
        sendResponse(
          res,
          HttpStatusCodes.BadRequest,
          null,
          HttpStatusMessages.IdRequired
        );
      } else {
        sendResponse(
          res,
          HttpStatusCodes.InternalServerError,
          null,
          HttpStatusMessages.InternalServerError
        );
      }
    }
  }
}
