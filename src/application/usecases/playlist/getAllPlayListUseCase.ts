import { IdDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import {
  AuthStatus,
} from "../../../shared/constants/index-constants";
import { Playlist } from "../../../domain/entities/playList";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";

export class GetallPlaylistUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  public async getallPlaylists(trainerId: IdDTO): Promise<Playlist[]> {
    if (!trainerId) {
      throw new validationError(
        AuthStatus.AllFieldsAreRequired
      );
    }
    const playListData = await this.playListRepository.getallPlaylists(
      trainerId
    );

    return playListData;
  }
}
