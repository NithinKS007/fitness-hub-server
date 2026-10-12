import { GetVideosDTO } from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { Video } from "@domain/entities/video.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { VideoUILayer } from "@application/dtos/read-models";

export interface IVideoRepository extends IBaseRepository<Video> {
  getVideos(dtos: GetVideosDTO): Promise<PagedResponse<VideoUILayer>>;
}
