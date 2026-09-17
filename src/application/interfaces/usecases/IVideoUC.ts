import {
  CreateVideo,
  EditVideoDTO,
  GetVideoDetails,
  UpdateVideoPrivacyDTO,
} from "@application/dtos/video-dtos";
import { IBaseUseCase } from "./IBase.UC";
import { Video } from "@domain/entities/video.entity";
import { GetVideosDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { VideoUILayer } from "@infrastructure/mappers/video.mapper";

export interface ICreateVideoUC extends IBaseUseCase<CreateVideo, Video> {}
export interface IEditVideoUC extends IBaseUseCase<EditVideoDTO, Video> {}
export interface IGetVideosUC
  extends IBaseUseCase<
    GetVideosDTO,
    {
      videoList: VideoUILayer[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetVideoDetailsUC
  extends IBaseUseCase<GetVideoDetails, Video> {}
export interface IUpdateVideoPrivacyUC
  extends IBaseUseCase<UpdateVideoPrivacyDTO, Video> {}
