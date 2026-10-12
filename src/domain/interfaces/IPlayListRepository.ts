import { VideoPerPlayList } from "@application/dtos/playlist-dtos";
import { GetPlayListsDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { PlayList } from "@domain/entities/playlist.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IPlayListRepository
  extends IBaseRepository<PlayList> {
  getPlaylists(
    dtos: GetPlayListsDTO
  ): Promise<{ playList: PlayList[]; paginationData: PaginationDTO }>;
  getPlaylistCounts(playListIds: string[]): Promise<VideoPerPlayList[]>;
  updateVideosCount(VideoPerPlayList: VideoPerPlayList[]): Promise<void>;
  getallPlaylists(trainerId: string, privacy?: boolean): Promise<PlayList[]>;
}
