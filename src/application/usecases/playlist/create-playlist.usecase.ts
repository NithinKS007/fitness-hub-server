import { CreatePlayListDTO } from "@application/dtos/playlist-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  PlayListStatus,
} from "@shared/constants/index.constants";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { PlayList } from "@domain/entities/playlist.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { ICreatePlayListUC } from "@application/interfaces/usecases/IPlaylistUC";

@injectable()
export class CreatePlayListUseCase implements ICreatePlayListUC{
  constructor(
    @inject(TYPES_REPOSITORIES.PlayListRepository)
    private playListRepository: IPlayListRepository
  ) {}
  
  async execute({ title, trainerId }: CreatePlayListDTO): Promise<PlayList> {
    if (!title || !trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const existingName = await this.playListRepository.findOne({
      title: title,
    });

    if (existingName) {
      throw new validationError(PlayListStatus.NameExists);
    }
    return await this.playListRepository.create({ title, trainerId });
  }
}
