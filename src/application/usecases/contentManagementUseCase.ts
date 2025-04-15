import {
  CreatedVideoDTO,
  CreatePlayListDTO,
  EditVideo,
  UpdatePlayListBlockStatus,
  UpdateVideoBlockStatus,
} from "../dtos/contentDTOs";
import { IdDTO, PaginationDTO } from "../dtos/utilityDTOs";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { Playlist } from "../../domain/entities/playListEntity";
import { Video } from "../../domain/entities/videoEntity";
import { IPlayListRepository } from "../../domain/interfaces/IPlayListRepository";
import { IVideoRepository } from "../../domain/interfaces/IVideoRepository";
import { IVideoPlayListRepository } from "../../domain/interfaces/IVideoPlayListRepository";
import { GetPlayListsQueryDTO, GetVideoQueryDTO } from "../dtos/queryDTOs";
import { parseDateRange } from "../../shared/utils/dayjs";

export class ContentManagementUseCase {
  constructor(
    private playListRepository: IPlayListRepository,
    private videoRepository: IVideoRepository,
    private videoPlayListRepository: IVideoPlayListRepository
  ) {}

  public async createPlayList({
    title,
    trainerId,
  }: CreatePlayListDTO): Promise<Playlist> {
    if (!title || !trainerId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    return await this.playListRepository.createPlayList({ title, trainerId });
  }
  public async getPlayListsTrainer(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetPlayListsQueryDTO
  ): Promise<{ playList: Playlist[]; paginationData: PaginationDTO }> {
    if (!trainerId) {
      throw new validationError(HttpStatusMessages.IdRequired);
    }
    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { playList, paginationData } =
      await this.playListRepository.getAllPlayListsByTrainerId(trainerId, {
        limit,
        page,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });

    return { playList, paginationData };
  }

  public async createdVideo({
    video,
    description,
    duration,
    playLists,
    thumbnail,
    title,
    trainerId,
  }: CreatedVideoDTO): Promise<Video> {
    if (
      !video ||
      !description ||
      !duration ||
      !playLists ||
      !thumbnail ||
      !title ||
      !trainerId
    ) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const createdVideo = await this.videoRepository.createVideo({
      video,
      description,
      duration,
      playLists,
      thumbnail,
      title,
      trainerId,
    });

    if (createdVideo && playLists && playLists.length > 0) {
      const videoPlayListDocs = playLists.map((list) => ({
        videoId: createdVideo._id.toString(),
        playListId: list,
      }));

      await this.playListRepository.updateManyVideoCount(playLists);
      await this.videoPlayListRepository.insertManyVideoPlayList(
        videoPlayListDocs
      );
    }
    return createdVideo;
  }

  public async getVideosByTrainerId(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO
  ): Promise<{ videoList: Video[]; paginationData: PaginationDTO }> {
    if (!trainerId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { videoList, paginationData } =
      await this.videoRepository.getVideosOfTrainerByTrainerId(trainerId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });
    return { videoList, paginationData };
  }

  public async updateVideoBlockStatus({
    videoId,
    privacy,
  }: UpdateVideoBlockStatus): Promise<Video> {
    if (!videoId || !privacy) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const updatedVideoData = await this.videoRepository.updateVideoBlockStatus({
      videoId,
      privacy,
    });

    if (!updatedVideoData) {
      throw new validationError(HttpStatusMessages.FailedToUpdateBlockStatus);
    }
    return updatedVideoData;
  }

  public async updatePlayListBlockStatus({
    playListId,
    privacy,
  }: UpdatePlayListBlockStatus): Promise<Playlist> {
    if (!playListId || !privacy) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const updatedPlayListData =
      await this.playListRepository.updatePlayListBlockStatus({
        playListId,
        privacy,
      });
    if (!updatedPlayListData) {
      throw new validationError(HttpStatusMessages.FailedToUpdateBlockStatus);
    }

    return updatedPlayListData;
  }

  public async getAllPlayListsOfTrainer(trainerId: IdDTO): Promise<Playlist[]> {
    if (!trainerId) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const playListData =
      await this.playListRepository.getFullPlayListsOfTrainer(trainerId);

    return playListData;
  }

  public async editVideo({
    _id,
    description,
    duration,
    playLists,
    thumbnail,
    title,
    trainerId,
    video,
  }: EditVideo): Promise<Video> {
    if (
      !_id ||
      !description ||
      !duration ||
      !playLists ||
      !thumbnail ||
      !title ||
      !trainerId ||
      !video
    ) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const editedVideo = await this.videoRepository.editVideo({
      _id,
      description,
      duration,
      playLists,
      thumbnail,
      title,
      trainerId,
      video,
    });

    if (!editedVideo) {
      throw new validationError(HttpStatusMessages.FailedToEditVideo);
    }

    if (editedVideo && playLists && playLists.length > 0) {
      const videoPlayListDocs = playLists.map((list) => ({
        videoId: editedVideo._id.toString(),
        playListId: list,
      }));

      const videoIdsToDelete = videoPlayListDocs.map((list) => list.videoId);
      await this.playListRepository.updateManyVideoCount(playLists);
      await this.videoPlayListRepository.bulkWriteAddNewDeleteUnused(
        videoPlayListDocs,
        videoIdsToDelete
      );
    }
    return editedVideo;
  }
}
