import { NextFunction, Request, Response } from "express";
import {
  HttpStatusCodes,
  HttpStatusMessages,
} from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";
import { ContentManagementUseCase } from "../../application/usecases/contentManagementUseCase";
import { MonogVideoPlayListRepository } from "../../infrastructure/databases/repositories/videoPlayList";
import { MongoPlayListRepository } from "../../infrastructure/databases/repositories/playListRepository";
import { MonogVideoRepository } from "../../infrastructure/databases/repositories/videoRepository";
import logger from "../../infrastructure/logger/logger";
import { handleLogError } from "../../shared/utils/handleLogError";

//MONGO REPOSITORY INSTANCES
const mongoPlayListRepository = new MongoPlayListRepository();
const monogVideoRepository = new MonogVideoRepository();
const monogVideoPlayListRepository = new MonogVideoPlayListRepository();

//USE CASE INSTANCES
const contentManagementUseCase = new ContentManagementUseCase(
  mongoPlayListRepository,
  monogVideoRepository,
  monogVideoPlayListRepository
);

export class ContentController {
  static async addPlaylist(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { title } = req.body;
      const createdPlayList = await contentManagementUseCase.createPlayList({
        trainerId: trainerId,
        title,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        createdPlayList,
        HttpStatusMessages.PlayListCreated
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.addPlaylist",
        "Error creating playlist"
      );
      next(error);
    }
  }

  static async getPlayListsTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { fromDate, toDate, page, limit, search, filters } = req.query;
      const { playList, paginationData } =
        await contentManagementUseCase.getPlayListsTrainer(trainerId, {
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
        HttpStatusMessages.PlayListsOfTrainerRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.getPlayListsTrainer",
        "Error getting playlists of trainer"
      );
      next(error);
    }
  }

  static async getAllPlayListsTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const playListData =
        await contentManagementUseCase.getAllPlayListsOfTrainer(trainerId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        playListData,
        HttpStatusMessages.PlayListsOfTrainerRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.getAllPlayListsTrainer",
        "Error getting playlists of trainer"
      );
      next(error);
    }
  }

  static async addVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const createdVideo = await contentManagementUseCase.createdVideo({
        trainerId: trainerId,
        ...req.body,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        createdVideo,
        HttpStatusMessages.VideoUploadedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.addVideo",
        "Error uploading video"
      );
      next(error);
    }
  }

  static async getVideosByTrainerId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { fromDate, toDate, page, limit, search, filters } = req.query;
      const { videoList, paginationData } =
        await contentManagementUseCase.getVideosByTrainerId(trainerId, {
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
        { videoList: videoList, paginationData: paginationData },
        HttpStatusMessages.VideoDataRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.getVideosByTrainerId",
        "Error getting videos of trainer"
      );
      next(error);
    }
  }

  static async gettrainerVideosUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.params.trainerId;
      const { fromDate, toDate, page, limit, search, filters } = req.query;
      const { videoList, paginationData } =
        await contentManagementUseCase.getVideosByTrainerId(trainerId, {
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
        { videoList: videoList, paginationData: paginationData },
        HttpStatusMessages.VideoDataRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.gettrainerVideosUser",
        "Error getting videos of trainer"
      );
      next(error);
    }
  }

  static async getPlayListsByTrainerId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.params.trainerId;
      const playListsOfTrainer =
        await contentManagementUseCase.getAllPlayListsOfTrainer(trainerId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        playListsOfTrainer,
        HttpStatusMessages.PlayListsOfTrainerRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.getPlayListsByTrainerId",
        "Error getting trainer playlists"
      );
      next(error);
    }
  }

  // static async getVideoById(req: Request, res: Response,next:NextFunction): Promise<void> {
  //   try {
  //     const { videoId }= req.params
  //     const videoData = await contentManagementUseCase.getVideoById(videoId)
  //     sendResponse(res,HttpStatusCodes.OK,videoData,HttpStatusMessages.VideoDataRetrievedSuccessfully)
  //   } catch (error: any) {
  //     logger.error(`Error retrieving video data: ${error}`);
  //     next(error)
  //   }
  // }

  static async updateVideoBlockStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { videoId } = req.params;
      const { privacy } = req.body;
      const videoData = await contentManagementUseCase.updateVideoBlockStatus({
        videoId,
        privacy,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        videoData,
        HttpStatusMessages.BlockStatusUpdated
      );
    } catch (error: any) {
      handleLogError(
        error,
        "ContentController.updateVideoBlockStatus",
        "Error updateing video block status"
      );
      next(error);
    }
  }

  static async updatePlayListBlockStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const playListId = req.params.playListId;
      const { privacy } = req.body;
      const playListData =
        await contentManagementUseCase.updatePlayListBlockStatus({
          playListId,
          privacy,
        });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        playListData,
        HttpStatusMessages.BlockStatusUpdated
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.updatePlayListBlockStatus",
        "Error updateing playlist block status"
      );
      next(error);
    }
  }

  static async editVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const videoId = req.params.videoId;
      const trainerId = req.user._id;
      const { title, description, video, thumbnail, playLists, duration } =
        req.body;
      const editedVideoData = await contentManagementUseCase.editVideo({
        trainerId: trainerId as string,
        _id: videoId as string,
        title: title as string,
        description: description as string,
        video: video as string,
        thumbnail: thumbnail as string,
        playLists: playLists as string[],
        duration: duration as number,
      });
      sendResponse(
        res,
        HttpStatusCodes.OK,
        editedVideoData,
        HttpStatusMessages.videoEditedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.editVideo",
        "Error updateing video data"
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
      sendResponse(
        res,
        HttpStatusCodes.OK,
        null,
        HttpStatusMessages.PlayListEditedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.editPlayList",
        "Error updateing playlist data"
      )
      next(error);
    }
  }
}
