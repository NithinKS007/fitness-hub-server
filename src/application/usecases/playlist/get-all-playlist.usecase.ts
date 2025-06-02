import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ApplicationStatus } from "../../../shared/constants/index.constants";
import { Playlist } from "../../../domain/entities/playlist.entities";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";

export class GetallPlaylistUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  async getallPlaylists(trainerId: string): Promise<Playlist[]> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const playListData = await this.playListRepository.getallPlaylists(
      trainerId
    );
    return playListData;
  }
}
