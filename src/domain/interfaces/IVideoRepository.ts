import { GetVideoQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { VideoWithPlayLists } from "@application/dtos/video-dtos";
import { Video } from "@domain/entities/video.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IVideo } from "@infrastructure/databases/models/video.model";

export interface IVideoRepository extends IBaseRepository<IVideo, Video> {
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
