import { UpdateVideoPrivacyDTO } from "@application/dtos/video-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  BlockStatus,
} from "@shared/constants/index.constants";
import { IVideoRepository } from "@domain/interfaces/IVideoRepository";
import { IVideo } from "@domain/entities/video.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

/**
 * Purpose: Update the privacy setting of a given video.
 * Incoming: { videoId, privacy } - The ID of the video and the new privacy setting.
 * Returns: IVideo - The updated video data.
 * Throws: validationError if the videoId or privacy is missing, or if the update fails.
 */

@injectable()
export class UpdateVideoPrivacyUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.VideoRepository)
    private videoRepository: IVideoRepository
  ) {}
  
  async execute({ videoId, privacy }: UpdateVideoPrivacyDTO): Promise<IVideo> {
    if (videoId === null || privacy === null) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const updatedVideoData = await this.videoRepository.update(videoId, {
      privacy,
    });
    if (!updatedVideoData) {
      throw new validationError(BlockStatus.StatusUpdateFailed);
    }
    return updatedVideoData;
  }
}
