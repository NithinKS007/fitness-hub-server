import { PaginationDTO } from "@application/dtos/utility-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus } from "@shared/constants/index.constants";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { GetPlayListsQueryDTO } from "@application/dtos/query-dtos";
import { IPlayList } from "@domain/entities/playlist.entity";

export class GetPlayListUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  async execute(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetPlayListsQueryDTO
  ): Promise<{ playList: IPlayList[]; paginationData: PaginationDTO }> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters };
    const { playList, paginationData } =
      await this.playListRepository.getPlaylists(trainerId, query);

    return { playList, paginationData };
  }
}
