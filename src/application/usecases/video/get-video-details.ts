import { validationError } from "@presentation/middlewares/error.middleware";
import { VideoStatus } from "@shared/constants/index.constants";
import { IVideoRepository } from "@domain/interfaces/IVideoRepository";
import { IVideo } from "@domain/entities/video.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

/**
 * Purpose: Fetch detailed information of a specific video by its ID.
 * Incoming: { videoId } - The unique identifier of the video.
 * Returns: A single video object containing all the details.
 * Throws: validationError if the video cannot be found || video access not given
 */

@injectable()
export class GetVideoDetailsUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.VideoRepository)
    private videoRepository: IVideoRepository
  ) {}
  
  async execute(videoId: string, privacy?: boolean): Promise<IVideo> {
    const videoData = await this.videoRepository.findById(videoId);
    if (!videoData) {
      throw new validationError(VideoStatus.FailedToGetVideo);
    }
    if (privacy !== undefined && videoData.privacy === true) {
      throw new validationError(VideoStatus.FailedToGetVideo);
    }
    return videoData;
  }
}
