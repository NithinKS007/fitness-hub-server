import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { IPlayList } from "@domain/entities/playlist.entity";

export class GetallPlaylistUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  async execute(trainerId: string, privacy?: boolean): Promise<IPlayList[]> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const playListData = await this.playListRepository.getallPlaylists(
      trainerId,
      privacy
    );
    return playListData;
  }
}
