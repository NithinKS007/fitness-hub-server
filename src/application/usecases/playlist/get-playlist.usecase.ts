import { PaginationDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { AuthStatus } from "../../../shared/constants/index.constants";
import { Playlist } from "../../../domain/entities/playlist.entities";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";
import { GetPlayListsQueryDTO } from "../../dtos/query-dtos";

export class GetPlayListUseCase {
  constructor(private playListRepository: IPlayListRepository) {}
  async execute(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetPlayListsQueryDTO
  ): Promise<{ playList: Playlist[]; paginationData: PaginationDTO }> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters };
    const { playList, paginationData } =
      await this.playListRepository.getPlaylists(trainerId, query);

    return { playList, paginationData };
  }
}
