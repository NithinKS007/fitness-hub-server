import { NextFunction, Request, Response } from "express";
import {
  BlockStatusMessage,
  HttpStatusCodes,
  PlayListStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { MongoPlayListRepository } from "../../../infrastructure/databases/repositories/playListRepository";
import { LoggerService } from "../../../infrastructure/logging/logger";
import { LoggerHelper } from "../../../shared/utils/handleLog";
import { CreatePlayListUseCase } from "../../../application/usecases/playlist/createPlayListUseCase";
import { EditPlayListUseCase } from "../../../application/usecases/playlist/editPlayListUseCase";
import { GetallPlaylistUseCase } from "../../../application/usecases/playlist/getAllPlayListUseCase";
import { GetPlayListUseCase } from "../../../application/usecases/playlist/getPlayListUseCase";
import { UpdatePlayListPrivacyUseCase } from "../../../application/usecases/playlist/updatePlayListPrivacyUseCase";

//MONGO REPOSITORY INSTANCES
const mongoPlayListRepository = new MongoPlayListRepository();

//SERVICE INSTANCES
const logger = new LoggerService();
const loggerHelper = new LoggerHelper(logger);

//USE CASE INSTANCES
const createPlayListUseCase = new CreatePlayListUseCase(
  mongoPlayListRepository
);

const editPlayListUseCase = new EditPlayListUseCase(mongoPlayListRepository);
const getallPlaylistUseCase = new GetallPlaylistUseCase(
  mongoPlayListRepository
);
const getPlayListUseCase = new GetPlayListUseCase(mongoPlayListRepository);
const updatePlayListPrivacyUseCase = new UpdatePlayListPrivacyUseCase(
  mongoPlayListRepository
);

export class PlayListController {
  static async addPlaylist(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { title } = req.body;
      const createdPlayList = await createPlayListUseCase.createPlayList({
        trainerId: trainerId,
        title,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        createdPlayList,
        PlayListStatusMessage.PlayListCreated
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "PlayListController.addPlaylist",
        "Error creating playlist"
      );
      next(error);
    }
  }

  static async getPlaylists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { fromDate, toDate, page, limit, search, filters } = req.query;
      const { playList, paginationData } =
        await getPlayListUseCase.getPlaylists(trainerId, {
          fromDate: fromDate as any,
          toDate: toDate as any,
          page: page as string,
          limit: limit as string,
          search: search as string,
          filters: filters as string[],
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        { playList: playList, paginationData: paginationData },
        PlayListStatusMessage.PlayListsOfTrainerRetrievedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "PlayListController.getPlayLists",
        "Error getting playlists of trainer"
      );
      next(error);
    }
  }

  static async getallPlayLists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.params.trainerId || req.user._id;
      const playListsOfTrainer =
        await getallPlaylistUseCase.getallPlaylists(trainerId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        playListsOfTrainer,
        PlayListStatusMessage.PlayListsOfTrainerRetrievedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "PlayListController.getallPlayLists",
        "Error getting trainer playlists"
      );
      next(error);
    }
  }

  static async updatePlayListPrivacy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const playListId = req.params.playListId;
      const { privacy } = req.body;
      const playListData =
        await updatePlayListPrivacyUseCase.updatePlayListPrivacy({
          playListId,
          privacy,
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        playListData,
        BlockStatusMessage.BlockStatusUpdated
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "PlayListController.updatePlayListPrivacy",
        "Error updateing playlist block status"
      );
      next(error);
    }
  }

  static async editPlayList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { playListId } = req.params;
      const title = req.body.title;
      const updatedPlayListData = await editPlayListUseCase.editPlayList({
        playListId,
        title,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedPlayListData,
        PlayListStatusMessage.PlayListEditedSuccessfully
      );
    } catch (error) {
      loggerHelper.handleLogError(
        error,
        "PlayListController.editPlayList",
        "Error updateing playlist data"
      );
      next(error);
    }
  }
}
