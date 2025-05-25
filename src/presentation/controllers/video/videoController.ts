import { Request, Response } from "express";
import {
  HttpStatusCodes,
  VideoStatus,
  BlockStatus,
} from "../../../shared/constants/index-constants";
import { sendResponse } from "../../../shared/utils/httpResponse";
import { CreateVideoUseCase } from "../../../application/usecases/video/createVideoUseCase";
import { EditVideoUseCase } from "../../../application/usecases/video/editVideoUseCase";
import { UpdateVideoPrivacyUseCase } from "../../../application/usecases/video/updateVideoPrivacyUseCase";
import { GetVideoUseCase } from "../../../application/usecases/video/getVideoUseCase";

export class VideoController {
  constructor(
    private createVideoUseCase: CreateVideoUseCase,
    private editVideoUseCase: EditVideoUseCase,
    private updateVideoPrivacyUseCase: UpdateVideoPrivacyUseCase,
    private getVideoUseCase: GetVideoUseCase
  ) {}
  public async addVideo(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const createdVideo = await this.createVideoUseCase.createdVideo({
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

  public async getVideos(req: Request, res: Response): Promise<void> {
    const trainerId = req.user._id;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { videoList, paginationData } = await this.getVideoUseCase.getVideos(
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

  public async getPublicVideos(req: Request, res: Response): Promise<void> {
    const trainerId = req.params.trainerId;
    const { fromDate, toDate, page, limit, search, filters } = req.query;
    const { videoList, paginationData } =
      await this.getVideoUseCase.getPublicVideos(trainerId, {
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
      VideoStatus.VideoDataRetrievedSuccessfully
    );
  }

  public async getVideoById(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;
    const videoData = await this.getVideoUseCase.getVideoById(videoId);
    sendResponse(
      res,
      HttpStatusCodes.OK,
      videoData,
      VideoStatus.VideoDataRetrievedSuccessfully
    );
  }

  public async updateVideoPrivacy(req: Request, res: Response): Promise<void> {
    const { videoId } = req.params;
    const { privacy } = req.body;
    const videoData = await this.updateVideoPrivacyUseCase.updateVideoPrivacy({
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

  public async editVideo(req: Request, res: Response): Promise<void> {
    const videoId = req.params.videoId;
    const trainerId = req.user._id;
    const { title, description, video, thumbnail, playLists, duration } =
      req.body;
    const editedVideoData = await this.editVideoUseCase.editVideo({
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
