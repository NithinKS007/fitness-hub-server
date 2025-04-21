import { NextFunction, Request, Response } from "express";
import {
  BlockStatusMessage,
  HttpStatusCodes,
  PlayListStatusMessage,
  VideoStatusMessage,
} from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";
import { ContentManagementUseCase } from "../../application/usecases/contentManagementUseCase";
import { MonogVideoPlayListRepository } from "../../infrastructure/databases/repositories/videoPlayList";
import { MongoPlayListRepository } from "../../infrastructure/databases/repositories/playListRepository";
import { MonogVideoRepository } from "../../infrastructure/databases/repositories/videoRepository";
import logger from "../../infrastructure/logger/logger";
import { handleLogError } from "../../shared/utils/handleLog";

//MONGO REPOSITORY INSTANCES
const mongoPlayListRepository = new MongoPlayListRepository();
const mongoVideoRepository = new MonogVideoRepository();
const mongoVideoPlayListRepository = new MonogVideoPlayListRepository();

//USE CASE INSTANCES
const contentManagementUseCase = new ContentManagementUseCase(
  mongoPlayListRepository,
  mongoVideoRepository,
  mongoVideoPlayListRepository
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
        PlayListStatusMessage.PlayListCreated
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

  static async getTrainerPlaylists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.user._id;
      const { fromDate, toDate, page, limit, search, filters } = req.query;
      const { playList, paginationData } =
        await contentManagementUseCase.getTrainerPlaylists(trainerId, {
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
      handleLogError(
        error,
        "ContentController.getPlayListsTrainer",
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
        VideoStatusMessage.VideoUploadedSuccessfully
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

  static async getTrainerVideos(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerId = req.params.trainerId || req.user._id;
      const { fromDate, toDate, page, limit, search, filters } = req.query;
      const { videoList, paginationData } =
        await contentManagementUseCase.getTrainerVideos(trainerId, {
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
        VideoStatusMessage.VideoDataRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.getTrainerVideos",
        "Error getting videos of trainer"
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
        await contentManagementUseCase.getallTrainerPlaylists(trainerId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        playListsOfTrainer,
        PlayListStatusMessage.PlayListsOfTrainerRetrievedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.getallPlayLists",
        "Error getting trainer playlists"
      );
      next(error);
    }
  }

  static async getVideoById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { videoId } = req.params;
      const videoData = await contentManagementUseCase.getVideoById(videoId);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        videoData,
        VideoStatusMessage.VideoDataRetrievedSuccessfully
      );
    } catch (error: any) {
      logger.error(`Error retrieving video data: ${error}`);
      next(error);
    }
  }

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
        BlockStatusMessage.BlockStatusUpdated
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
        BlockStatusMessage.BlockStatusUpdated
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
        VideoStatusMessage.videoEditedSuccessfully
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
      const title = req.body.title;
      const updatedPlayListData = await contentManagementUseCase.editPlayList({
        playListId,
        title,
      });
      console.log("updated data", updatedPlayListData);
      sendResponse(
        res,
        HttpStatusCodes.OK,
        updatedPlayListData,
        PlayListStatusMessage.PlayListEditedSuccessfully
      );
    } catch (error) {
      handleLogError(
        error,
        "ContentController.editPlayList",
        "Error updateing playlist data"
      );
      next(error);
    }
  }
}
