import { VideoPerPlayList } from "@application/dtos/playlist-dtos";
import { GetPlayListsQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { PlayList } from "@domain/entities/playlist.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IPlayList } from "@infrastructure/databases/models/playlist.model";

export interface IPlayListRepository
  extends IBaseRepository<IPlayList, PlayList> {
  getPlaylists(
    dtos: GetPlayListsQueryDTO
  ): Promise<{ playList: PlayList[]; paginationData: PaginationDTO }>;
  getPlaylistCounts(playListIds: string[]): Promise<VideoPerPlayList[]>;
  updateVideosCount(VideoPerPlayList: VideoPerPlayList[]): Promise<void>;
  getallPlaylists(trainerId: string, privacy?: boolean): Promise<PlayList[]>;
}
