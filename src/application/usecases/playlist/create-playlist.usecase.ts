import { CreatePlayListDTO } from "../../dtos/playlist-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { ApplicationStatus } from "../../../shared/constants/index.constants";
import { Playlist } from "../../../domain/entities/playlist.entities";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";

export class CreatePlayListUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  async addPlaylist({
    title,
    trainerId,
  }: CreatePlayListDTO): Promise<Playlist> {
    if (!title || !trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    return await this.playListRepository.addPlaylist({ title, trainerId });
  }
}
