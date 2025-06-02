import { PaginationDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  VideoStatus,
} from "../../../shared/constants/index.constants";
import {
  Video,
  VideoWithPlayLists,
} from "../../../domain/entities/video.entities";
import { IVideoRepository } from "../../../domain/interfaces/IVideoRepository";
import { GetVideoQueryDTO } from "../../dtos/query-dtos";

export class GetVideoUseCase {
  constructor(private videoRepository: IVideoRepository) {}

  async getVideos(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters };
    const { videoList, paginationData } = await this.videoRepository.getVideos(
      trainerId,
      query
    );
    return { videoList, paginationData };
  }

  async getPublicVideos(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters };
    const { videoList, paginationData } =
      await this.videoRepository.getPublicVideos(trainerId, query);
    return { videoList, paginationData };
  }

  async getVideoById(videoId: string): Promise<Video> {
    const videoData = await this.videoRepository.getVideoById(videoId);
    if (!videoData) {
      throw new validationError(VideoStatus.FailedToGetVideo);
    }
    return videoData;
  }
}
