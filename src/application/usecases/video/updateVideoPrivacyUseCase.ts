import { UpdateVideoPrivacyDTO } from "../../dtos/video-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
  BlockStatus,
} from "../../../shared/constants/index-constants";
import { Video } from "../../../domain/entities/video";
import { IVideoRepository } from "../../../domain/interfaces/IVideoRepository";

export class UpdateVideoPrivacyUseCase {
  constructor(private videoRepository: IVideoRepository) {}

  public async updateVideoPrivacy({
    videoId,
    privacy,
  }: UpdateVideoPrivacyDTO): Promise<Video> {
    if (videoId === null || privacy === null) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }
    const updatedVideoData = await this.videoRepository.updateVideoPrivacy({
      videoId,
      privacy,
    });

    if (!updatedVideoData) {
      throw new validationError(BlockStatus.FailedToUpdateBlockStatus);
    }
    return updatedVideoData;
  }
}
