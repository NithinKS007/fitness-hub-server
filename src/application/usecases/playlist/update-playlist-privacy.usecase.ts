import { UpdatePlayListPrivacyDTO } from "@application/dtos/playlist-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  BlockStatus,
} from "@shared/constants/index.constants";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { IPlayList } from "@domain/entities/playlist.entity";

export class UpdatePlayListPrivacyUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  async execute({
    playListId,
    privacy,
  }: UpdatePlayListPrivacyDTO): Promise<IPlayList> {
    if (playListId === null || privacy === null) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const updatedPlayListData = await this.playListRepository.update(
      playListId,
      {
        privacy,
      }
    );
    if (!updatedPlayListData) {
      throw new validationError(BlockStatus.StatusUpdateFailed );
    }
    return updatedPlayListData;
  }
}
