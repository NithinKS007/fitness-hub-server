import { PaginationDTO } from "@application/dtos/utility-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus } from "@shared/constants/index.constants";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { GetPlayListsQueryDTO } from "@application/dtos/query-dtos";
import { PlayList } from "@domain/entities/playlist.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetPlayListUC } from "@application/interfaces/usecases/IPlaylistUC";

@injectable()
export class GetPlayListUseCase implements IGetPlayListUC {
  constructor(
    @inject(TYPES_REPOSITORIES.PlayListRepository)
    private playListRepository: IPlayListRepository
  ) {}
  
  async execute(
    { trainerId, page, limit, fromDate, toDate, search, filters }: GetPlayListsQueryDTO
  ): Promise<{ playList: PlayList[]; paginationData: PaginationDTO }> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters ,trainerId};
    const { playList, paginationData } =
      await this.playListRepository.getPlaylists(query);

    return { playList, paginationData };
  }
}
