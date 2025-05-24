import {
  CreateVideoDTO,
  EditVideoDTO,
  UpdateVideoPrivacyDTO,
} from "../../application/dtos/video-dtos";
import { GetVideoQueryDTO } from "../../application/dtos/query-dtos";
import { IdDTO, PaginationDTO } from "../../application/dtos/utility-dtos";
import { Video, VideoWithPlayLists } from "../entities/video";

export interface IVideoRepository {
  createVideo(createVideo: CreateVideoDTO): Promise<Video>;
  getVideos(
    trainerId: IdDTO,
    data: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }>;
  getPublicVideos(
    trainerId: IdDTO,
    data: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }>;
  getVideoById(videoId: IdDTO): Promise<Video | null>;
  updateVideoPrivacy(
    updateVideoBlockStatus: UpdateVideoPrivacyDTO
  ): Promise<Video | null>;
  editVideo(editVideo: EditVideoDTO): Promise<Video | null>;
}
