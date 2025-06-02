import { EditPlayListDTO } from "../../dtos/playlist-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { VideoStatus } from "../../../shared/constants/index.constants";
import { Playlist } from "../../../domain/entities/playlist.entities";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";

export class EditPlayListUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  async editPlayList({
    playListId,
    title,
  }: EditPlayListDTO): Promise<Playlist> {
    const playListData = await this.playListRepository.editPlayList({
      playListId,
      title,
    });
    if (!playListData) {
      throw new validationError(VideoStatus.FailedToGetVideo);
    }
    return playListData;
  }
}
