import { IdDTO, PaginationDTO } from "../../dtos/utility-dtos";
import { validationError } from "../../../presentation/middlewares/errorMiddleWare";
import { AuthStatus } from "../../../shared/constants/index-constants";
import { Playlist } from "../../../domain/entities/playList";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";
import { GetPlayListsQueryDTO } from "../../dtos/query-dtos";
import { parseDateRange } from "../../../shared/utils/dayjs";

export class GetPlayListUseCase {
  constructor(private playListRepository: IPlayListRepository) {}

  public async getPlaylists(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetPlayListsQueryDTO
  ): Promise<{ playList: Playlist[]; paginationData: PaginationDTO }> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const { parsedFromDate, parsedToDate } = parseDateRange(fromDate, toDate);

    const { playList, paginationData } =
      await this.playListRepository.getPlaylists(trainerId, {
        limit,
        page,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        search,
        filters,
      });

    return { playList, paginationData };
  }
}
