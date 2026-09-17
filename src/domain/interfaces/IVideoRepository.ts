import { GetVideosDTO } from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { Video } from "@domain/entities/video.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IVideo } from "@infrastructure/databases/models/video.model";
import { VideoUILayer } from "@infrastructure/mappers/video.mapper";

export interface IVideoRepository extends IBaseRepository<IVideo, Video> {
  getVideos(dtos: GetVideosDTO): Promise<PagedResponse<VideoUILayer>>;
}
