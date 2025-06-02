import {
  CreateVideoDTO,
  EditVideoDTO,
  UpdateVideoPrivacyDTO,
} from "../../application/dtos/video-dtos";
import { GetVideoQueryDTO } from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { Video, VideoWithPlayLists } from "../entities/video.entities";

export interface IVideoRepository {
  createVideo(createVideo: CreateVideoDTO): Promise<Video>;
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
  getVideoById(videoId: string): Promise<Video | null>;
  updatePrivacy(
    updateVideoBlockStatus: UpdateVideoPrivacyDTO
  ): Promise<Video | null>;
  editVideo(editVideo: EditVideoDTO): Promise<Video | null>;
}
