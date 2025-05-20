import { IdDTO, PaginationDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  VideoStatus,
} from "../../../shared/constants/index-constants";
import { Video, VideoWithPlayLists } from "../../../domain/entities/video";
import { IVideoRepository } from "../../../domain/interfaces/IVideoRepository";
import { GetVideoQueryDTO } from "../../dtos/query-dtos";
import { parseDateRange } from "../../../shared/utils/dayjs";

export class GetVideoUseCase {
  constructor(private videoRepository: IVideoRepository) {}

  public async getVideos(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }
    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { videoList, paginationData } =
      await this.videoRepository.getVideos(trainerId, {
        page,
        limit,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });
    return { videoList, paginationData };
  }

  public async getVideoById(videoId: IdDTO): Promise<Video> {
    const videoData = await this.videoRepository.getVideoById(videoId);
    if (!videoData) {
      throw new validationError(VideoStatus.FailedToGetVideo);
    }

    return videoData;
  }
}
