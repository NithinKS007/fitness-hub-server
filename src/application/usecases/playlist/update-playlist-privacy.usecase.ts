import { UpdatePlayListPrivacyDTO } from "../../dtos/playlist-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  BlockStatus,
} from "../../../shared/constants/index.constants";
import { Playlist } from "../../../domain/entities/playlist.entities";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";

export class UpdatePlayListPrivacyUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  async updatePrivacy({
    playListId,
    privacy,
  }: UpdatePlayListPrivacyDTO): Promise<Playlist> {
    if (playListId === null || privacy === null) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const updatedPlayListData = await this.playListRepository.updatePrivacy({
      playListId,
      privacy,
    });
    if (!updatedPlayListData) {
      throw new validationError(BlockStatus.FailedToUpdateBlockStatus);
    }

    return updatedPlayListData;
  }
}
