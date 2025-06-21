import { UpdatePlayListPrivacyDTO } from "@application/dtos/playlist-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  BlockStatus,
} from "@shared/constants/index.constants";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { IPlayList } from "@domain/entities/playlist.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

@injectable()
export class UpdatePlayListPrivacyUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.PlayListRepository)
    private playListRepository: IPlayListRepository
  ) {}
  
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
      throw new validationError(BlockStatus.StatusUpdateFailed);
    }
    return updatedPlayListData;
  }
}
