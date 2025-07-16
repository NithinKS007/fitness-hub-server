import { validationError } from "@presentation/middlewares/error.middleware";
import { VideoStatus } from "@shared/constants/index.constants";
import { IVideoRepository } from "@domain/interfaces/IVideoRepository";
import { Video } from "@domain/entities/video.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { GetVideoDetails } from "@application/dtos/video-dtos";
import { IGetVideoDetailsUC } from "@application/interfaces/usecases/IVideoUC";

/**
 * Purpose: Fetch detailed information of a specific video by its ID.
 * Incoming: { videoId } - The unique identifier of the video.
 * Returns: A single video object containing all the details.
 * Throws: validationError if the video cannot be found || video access not given
 */

@injectable()
export class GetVideoDetailsUseCase implements IGetVideoDetailsUC{
  constructor(
    @inject(TYPES_REPOSITORIES.VideoRepository)
    private videoRepository: IVideoRepository
  ) {}

  async execute({
    trainerId,
    videoId,
    privacy,
  }: GetVideoDetails): Promise<Video> {
    const videoData = await this.videoRepository.findOne({
      _id: videoId,
      trainerId,
    });
    if (!videoData) {
      throw new validationError(VideoStatus.FailedToGet);
    }
    if (privacy !== undefined && videoData.privacy === true) {
      throw new validationError(VideoStatus.FailedToGet);
    }
    return videoData;
  }
}
