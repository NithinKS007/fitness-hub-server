import { CreatePlayListDTO } from "../../dtos/playlist-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthenticationStatusMessage } from "../../../shared/constants/httpResponseStructure";
import { Playlist } from "../../../domain/entities/playList";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";

export class CreatePlayListUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  public async createPlayList({
    title,
    trainerId,
  }: CreatePlayListDTO): Promise<Playlist> {
    if (!title || !trainerId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    return await this.playListRepository.createPlayList({ title, trainerId });
  }
}
