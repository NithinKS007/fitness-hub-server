import { GetVideoQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { VideoWithPlayLists } from "@application/dtos/video-dtos";
import { IVideo } from "@domain/entities/video.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IVideoRepository extends IBaseRepository<IVideo> {
  getVideos(
    trainerId: string,
    data: GetVideoQueryDTO,
    videoPrivacy?: boolean,
    playlistPrivacy?: boolean
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }>;
}
