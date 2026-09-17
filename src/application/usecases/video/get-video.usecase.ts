import { PaginationDTO } from "@application/dtos/utility-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { IVideoRepository } from "@domain/interfaces/IVideoRepository";
import { GetVideoQueryDTO } from "@application/dtos/query-dtos";
import { VideoWithPlayLists } from "@application/dtos/video-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetVideosUC } from "@application/interfaces/usecases/IVideoUC";

/**
 * Purpose: Fetch videos for a specific trainer with pagination, search, filters, and optional privacy setting.
 * Incoming: { trainerId, query parameters, privacy? } - Trainer ID, query parameters for pagination,
 * and optional privacy filter.
 * Returns: An object containing the video list and pagination data.
 * Throws: validationError if required fields are missing or invalid.
 */

@injectable()
export class GetVideosUseCase implements IGetVideosUC {
  constructor(
    @inject(TYPES_REPOSITORIES.VideoRepository)
    private videoRepository: IVideoRepository
  ) {}

  async execute(
    { trainerId, page, limit, fromDate, 
      toDate, search, filters , videoPrivacy,
      playlistPrivacy }
    : GetVideoQueryDTO,
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { page, limit, fromDate, toDate, search, 
                  filters, trainerId, videoPrivacy, playlistPrivacy };
    const { videoList, paginationData } = await this.videoRepository.getVideos(
      query
    );
    return { videoList, paginationData };
  }
}
