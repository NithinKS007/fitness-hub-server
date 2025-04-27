import { EditPlayListDTO } from "../../dtos/playListDTOs";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { VideoStatusMessage } from "../../../shared/constants/httpResponseStructure";
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
      throw new validationError(VideoStatusMessage.FailedToGetVideo);
    }
    return playListData;
  }
}
