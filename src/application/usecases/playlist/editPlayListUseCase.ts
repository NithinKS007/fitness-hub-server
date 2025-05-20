import { EditPlayListDTO } from "../../dtos/playlist-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { VideoStatus} from "../../../shared/constants/index-constants";
import { Playlist } from "../../../domain/entities/playList";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";

export class EditPlayListUseCase {
  constructor(private playListRepository: IPlayListRepository) {}

  public async editPlayList({
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
