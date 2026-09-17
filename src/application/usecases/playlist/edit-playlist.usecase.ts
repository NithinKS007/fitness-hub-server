import { EditPlayListDTO } from "@application/dtos/playlist-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { PlayListStatus, VideoStatus } from "@shared/constants/index.constants";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { PlayList } from "@domain/entities/playlist.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IEditPlayListUC } from "@application/interfaces/usecases/IPlaylistUC";

@injectable()
export class EditPlayListUseCase  implements IEditPlayListUC {
  constructor(
    @inject(TYPES_REPOSITORIES.PlayListRepository)
    private playListRepository: IPlayListRepository
  ) {}

  async execute({ playListId, title }: EditPlayListDTO): Promise<PlayList> {
    const playlistData = await this.playListRepository.findById(playListId);

    if (!playlistData) {
      throw new validationError(PlayListStatus.NotFound);
    }

    const existingName = await this.playListRepository.findOne({
      title: title,
      _id: playlistData?._id,
    });

    if (existingName) {
      throw new validationError(PlayListStatus.NameExists);
    }

    const updatedPlaylist = await this.playListRepository.update(playListId, {
      title,
    });

    if (!updatedPlaylist) {
      throw new validationError(VideoStatus.FailedToGet);
    }
    return updatedPlaylist;
  }
}
