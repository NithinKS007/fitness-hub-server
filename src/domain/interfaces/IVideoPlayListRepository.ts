import {
  BulkWriteAddVideoPlayListDTO,
  BulkWriteDeleteVideoPlayListDTO,
  CreateVideoPlayListDTO,
} from "../../application/dtos/playlist-dtos";
import { VideoPlayList } from "../entities/video-playlist.entities";

export interface IVideoPlayListRepository {
  insertPlaylists(
    createVideoPlayList: CreateVideoPlayListDTO[]
  ): Promise<VideoPlayList[]>;
  bulkUpdatePlaylists(
    addPlayList: BulkWriteAddVideoPlayListDTO[],
    deletePlayList: BulkWriteDeleteVideoPlayListDTO[]
  ): Promise<void>;
}
