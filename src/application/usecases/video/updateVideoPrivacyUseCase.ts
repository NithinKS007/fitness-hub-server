import { UpdateVideoPrivacyDTO } from "../../dtos/videoDTOs";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  BlockStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
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
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const updatedVideoData = await this.videoRepository.updateVideoPrivacy({
      videoId,
      privacy,
    });

    if (!updatedVideoData) {
      throw new validationError(BlockStatusMessage.FailedToUpdateBlockStatus);
    }
    return updatedVideoData;
  }
}
