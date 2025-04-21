import {
  CreatedVideoDTO,
  CreatePlayListDTO,
  EditPlayList,
  EditVideo,
  UpdatePlayListBlockStatus,
  UpdateVideoBlockStatus,
} from "../dtos/contentDTOs";
import { IdDTO, PaginationDTO } from "../dtos/utilityDTOs";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  BlockStatusMessage,
  VideoStatusMessage,
} from "../../shared/constants/httpResponseStructure";
import { Playlist } from "../../domain/entities/playListEntity";
import { Video, VideoWithPlayLists } from "../../domain/entities/videoEntity";
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
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    return await this.playListRepository.createPlayList({ title, trainerId });
  }
  public async getTrainerPlaylists(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetPlayListsQueryDTO
  ): Promise<{ playList: Playlist[]; paginationData: PaginationDTO }> {
    if (!trainerId) {
      throw new validationError(AuthenticationStatusMessage.IdRequired);
    }
    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { playList, paginationData } =
      await this.playListRepository.getTrainerPlaylists(trainerId, {
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
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
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

      await this.videoPlayListRepository.insertManyVideoPlayList(
        videoPlayListDocs
      );
    
      const videoCountWithPlayList = await this.playListRepository.getNumberOfVideosPerPlaylist(playLists)

      if(videoCountWithPlayList.length > 0){
        await this.playListRepository.updateManyVideoCount(videoCountWithPlayList);
      }
     
    }
    return createdVideo;
  }

  public async getTrainerVideos(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO
  ): Promise<{ videoList: VideoWithPlayLists[]; paginationData: PaginationDTO }> {
    if (!trainerId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { videoList, paginationData } =
      await this.videoRepository.getTrainerVideos(trainerId, {
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
    if (videoId === null || privacy === null) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const updatedVideoData = await this.videoRepository.updateVideoBlockStatus({
      videoId,
      privacy,
    });

    if (!updatedVideoData) {
      throw new validationError(BlockStatusMessage.FailedToUpdateBlockStatus);
    }
    return updatedVideoData;
  }

  public async updatePlayListBlockStatus({
    playListId,
    privacy,
  }: UpdatePlayListBlockStatus): Promise<Playlist> {
    if (playListId === null || privacy === null) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const updatedPlayListData =
      await this.playListRepository.updatePlayListBlockStatus({
        playListId,
        privacy,
      });
    if (!updatedPlayListData) {
      throw new validationError(BlockStatusMessage.FailedToUpdateBlockStatus);
    }

    return updatedPlayListData;
  }

  public async getallTrainerPlaylists(trainerId: IdDTO): Promise<Playlist[]> {
    if (!trainerId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const playListData =
      await this.playListRepository.getallTrainerPlaylists(trainerId);

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
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
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
      throw new validationError(VideoStatusMessage.FailedToEditVideo);
    }

    if (editedVideo && playLists && playLists.length > 0) {
      const videoPlayListDocs = playLists.map((list) => ({
        videoId: editedVideo._id.toString(),
        playListId: list,
      }));

      const videoIdsToDelete = videoPlayListDocs.map((list) => list.videoId);
      const videoCountWithPlayList = await this.playListRepository.getNumberOfVideosPerPlaylist(playLists)

      if(videoCountWithPlayList.length > 0){
        await this.playListRepository.updateManyVideoCount(videoCountWithPlayList);
      }
      await this.videoPlayListRepository.bulkWriteAddNewDeleteUnused(
        videoPlayListDocs,
        videoIdsToDelete
      );
    }
    return editedVideo;
  }

  public async getVideoById(videoId: IdDTO): Promise<Video> {
    const videoData = await this.videoRepository.getVideoById(videoId);
    if (!videoData) {
      throw new validationError(VideoStatusMessage.FailedToGetVideo);
    }

    return videoData;
  }

  public async editPlayList({playListId,title}:EditPlayList): Promise<Playlist> {
    const playListData = await this.playListRepository.editPlayList({playListId,title});
    if (!playListData) {
      throw new validationError(VideoStatusMessage.FailedToGetVideo);
    }
    return playListData;
  }
}
