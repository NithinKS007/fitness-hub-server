import { GetVideoQueryDTO } from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { VideoWithPlayLists } from "../entities/video.entities";
import { IVideo } from "../../infrastructure/databases/models/video.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IVideoRepository extends IBaseRepository<IVideo> {
  getVideos(
    trainerId: string,
    data: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }>;
  getPublicVideos(
    trainerId: string,
    data: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }>;
}
