import { UpdatePlayListPrivacyDTO } from "../../dtos/playlist-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthenticationStatusMessage,
  BlockStatusMessage,
} from "../../../shared/constants/httpResponseStructure";
import { Playlist } from "../../../domain/entities/playList";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";

export class UpdatePlayListPrivacyUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  public async updatePlayListPrivacy({
    playListId,
    privacy,
  }: UpdatePlayListPrivacyDTO): Promise<Playlist> {
    if (playListId === null || privacy === null) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const updatedPlayListData =
      await this.playListRepository.updatePlayListPrivacy({
        playListId,
        privacy,
      });
    if (!updatedPlayListData) {
      throw new validationError(BlockStatusMessage.FailedToUpdateBlockStatus);
    }

    return updatedPlayListData;
  }
}
