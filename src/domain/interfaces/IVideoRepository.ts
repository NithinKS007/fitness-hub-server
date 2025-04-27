import {
  CreateVideoDTO,
  EditVideoDTO,
  UpdateVideoPrivacyDTO,
} from "../../application/dtos/videoDTOs";
import { GetVideoQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
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
  getVideoById(videoId: IdDTO): Promise<Video | null>;
  updateVideoPrivacy(
    updateVideoBlockStatus: UpdateVideoPrivacyDTO
  ): Promise<Video | null>;
  editVideo(editVideo: EditVideoDTO): Promise<Video | null>;
}
