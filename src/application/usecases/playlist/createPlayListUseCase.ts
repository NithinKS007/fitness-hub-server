import { CreatePlayListDTO } from "../../dtos/playlist-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
} from "../../../shared/constants/index-constants";
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
        AuthStatus.AllFieldsAreRequired
      );
    }
    return await this.playListRepository.createPlayList({ title, trainerId });
  }
}
