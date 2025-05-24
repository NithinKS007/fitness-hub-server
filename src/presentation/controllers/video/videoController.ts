import { Request, Response } from "express";
import {
  HttpStatusCodes,
  VideoStatus,
  BlockStatus,
} from "../../../shared/constants/index-constants";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { MonogVideoPlayListRepository } from "../../../infrastructure/databases/repositories/videoPlayList";
import { MongoPlayListRepository } from "../../../infrastructure/databases/repositories/playListRepository";
import { MonogVideoRepository } from "../../../infrastructure/databases/repositories/videoRepository";
import { CreateVideoUseCase } from "../../../application/usecases/video/createVideoUseCase";
import { EditVideoUseCase } from "../../../application/usecases/video/editVideoUseCase";
import { UpdateVideoPrivacyUseCase } from "../../../application/usecases/video/updateVideoPrivacyUseCase";
import { GetVideoUseCase } from "../../../application/usecases/video/getVideoUseCase";

//MONGO REPOSITORY INSTANCES
const mongoPlayListRepository = new MongoPlayListRepository();
const mongoVideoRepository = new MonogVideoRepository();
const mongoVideoPlayListRepository = new MonogVideoPlayListRepository();

//USE CASE INSTANCES
const editVideoUseCase = new EditVideoUseCase(
  mongoPlayListRepository,
  mongoVideoRepository,
  mongoVideoPlayListRepository
);

const createVideoUseCase = new CreateVideoUseCase(
  mongoPlayListRepository,
  mongoVideoRepository,
  mongoVideoPlayListRepository
);

const updateVideoPrivacyUseCase = new UpdateVideoPrivacyUseCase(
  mongoVideoRepository
);
const getVideoUseCase = new GetVideoUseCase(mongoVideoRepository);

export class VideoController {
  static async addVideo(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const createdVideo = await createVideoUseCase.createdVideo({
      trainerId: trainerId,
      ...req.body,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      createdVideo,
      VideoStatus.VideoUploadedSuccessfully
    );
  }

  static async getVideos(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { videoList, paginationData } = await getVideoUseCase.getVideos(
      trainerId,
      {
        fromDate: fromDate as any,
        toDate: toDate as any,
        page: page as string,
        limit: limit as string,
        search: search as string,
        filters: filters as string[],
      }
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { videoList: videoList, paginationData: paginationData },
      VideoStatus.VideoDataRetrievedSuccessfully
    );
  }

  static async getPublicVideos(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { videoList, paginationData } = await getVideoUseCase.getPublicVideos(
      trainerId,
      {
        fromDate: fromDate as any,
        toDate: toDate as any,
        page: page as string,
        limit: limit as string,
        search: search as string,
        filters: filters as string[],
      }
    );
    sendResponse(
      res,
      HttpStatusCodes.OK,
      { videoList: videoList, paginationData: paginationData },
      VideoStatus.VideoDataRetrievedSuccessfully
    );
  }

  static async getVideoById(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;
    const videoData = await getVideoUseCase.getVideoById(videoId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      videoData,
      VideoStatus.VideoDataRetrievedSuccessfully
    );
  }

  static async updateVideoPrivacy(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;
    const { privacy } = req.body;
    const videoData = await updateVideoPrivacyUseCase.updateVideoPrivacy({
      videoId,
      privacy,
    });
    sendResponse(
      res,
      HttpStatusCodes.OK,
      videoData,
      BlockStatus.BlockStatusUpdated
    );
  }

  static async editVideo(req: Request, res: Response): Promise<void> {
    const videoId = req.params.videoId;
    const trainerId = req.user._id;
    const { title, description, video, thumbnail, playLists, duration } =
      req.body;
    const editedVideoData = await editVideoUseCase.editVideo({
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
      VideoStatus.videoEditedSuccessfully
    );
  }
}
