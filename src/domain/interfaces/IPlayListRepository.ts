import { NumberOfVideoPerPlayList } from "@application/dtos/playlist-dtos";
import { GetPlayListsQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IPlayList } from "@domain/entities/playlist.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IPlayListRepository extends IBaseRepository<IPlayList> {
  getPlaylists(
    trainerId: string,
    data: GetPlayListsQueryDTO
  ): Promise<{ playList: IPlayList[]; paginationData: PaginationDTO }>;
  getPlaylistCounts(playListIds: string[]): Promise<NumberOfVideoPerPlayList[]>;
  updateManyVideoCount(
    numberOfVideosPerPlaylist: NumberOfVideoPerPlayList[]
  ): Promise<void>;
  getallPlaylists(trainerId: string, privacy?: boolean): Promise<IPlayList[]>;
}
