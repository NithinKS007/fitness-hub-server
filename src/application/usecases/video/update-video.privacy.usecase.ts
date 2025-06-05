import { UpdateVideoPrivacyDTO } from "../../dtos/video-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  BlockStatus,
} from "../../../shared/constants/index.constants";
import { Video } from "../../../domain/entities/video.entities";
import { IVideoRepository } from "../../../domain/interfaces/IVideoRepository";
import { IVideo } from "../../../infrastructure/databases/models/video.model";

export class UpdateVideoPrivacyUseCase {
  constructor(private videoRepository: IVideoRepository) {}
  async execute({ videoId, privacy }: UpdateVideoPrivacyDTO): Promise<IVideo> {
    if (videoId === null || privacy === null) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const updatedVideoData = await this.videoRepository.update(videoId, {
      privacy,
    });
    if (!updatedVideoData) {
      throw new validationError(BlockStatus.FailedToUpdateBlockStatus);
    }
    return updatedVideoData;
  }
}
