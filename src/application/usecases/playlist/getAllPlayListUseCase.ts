import { IdDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthenticationStatusMessage } from "../../../shared/constants/httpResponseStructure";
import { Playlist } from "../../../domain/entities/playList";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";

export class GetallPlaylistUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  public async getallPlaylists(trainerId: IdDTO): Promise<Playlist[]> {
    if (!trainerId) {
      throw new validationError(
        AuthenticationStatusMessage.AllFieldsAreRequired
      );
    }
    const playListData = await this.playListRepository.getallPlaylists(
      trainerId
    );

    return playListData;
  }
}
