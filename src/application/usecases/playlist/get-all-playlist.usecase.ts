import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { PlayList } from "@domain/entities/playlist.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetallPlaylistUC } from "@application/interfaces/usecases/IPlaylistUC";

@injectable()
export class GetallPlaylistUseCase implements IGetallPlaylistUC{
  constructor(
    @inject(TYPES_REPOSITORIES.PlayListRepository)
    private playListRepository: IPlayListRepository
  ) {}

  async execute({
    trainerId,
    privacy,
  }: {
    trainerId: string;
    privacy?: boolean;
  }): Promise<PlayList[]> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const playListData = await this.playListRepository.getallPlaylists(
      trainerId,
      privacy
    );
    return playListData;
  }
}
