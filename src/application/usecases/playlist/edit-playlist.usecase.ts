import { EditPlayListDTO } from "@application/dtos/playlist-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { PlayListStatus, VideoStatus } from "@shared/constants/index.constants";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { IPlayList } from "@domain/entities/playlist.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

@injectable()
export class EditPlayListUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.PlayListRepository)
    private playListRepository: IPlayListRepository
  ) {}
  
  async execute({ playListId, title }: EditPlayListDTO): Promise<IPlayList> {
    const playlistData = await this.playListRepository.findById(playListId);

    if (!playlistData) {
      throw new validationError(PlayListStatus.PlaylistNotFound);
    }

    const existingName = await this.playListRepository.findOne({
      title: title,
      _id: playlistData?._id,
    });

    if (existingName) {
      throw new validationError(PlayListStatus.NameExists);
    }
    const playListData = await this.playListRepository.update(playListId, {
      title,
    });
    if (!playListData) {
      throw new validationError(VideoStatus.FailedToGetVideo);
    }
    return playListData;
  }
}
