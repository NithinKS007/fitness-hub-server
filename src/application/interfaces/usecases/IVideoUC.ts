import {
  CreateVideo,
  EditVideoDTO,
  GetVideoDetails,
  UpdateVideoPrivacyDTO,
  VideoWithPlayLists,
} from "@application/dtos/video-dtos";
import { IBaseUseCase } from "./IBase.UC";
import { Video } from "@domain/entities/video.entity";
import { GetVideoQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";

export interface ICreateVideoUC extends IBaseUseCase<CreateVideo, Video> {}
export interface IEditVideoUC extends IBaseUseCase<EditVideoDTO, Video> {}
export interface IGetVideosUC
  extends IBaseUseCase<
    GetVideoQueryDTO,
    {
      videoList: VideoWithPlayLists[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetVideoDetailsUC
  extends IBaseUseCase<GetVideoDetails, Video> {}
export interface IUpdateVideoPrivacyUC extends IBaseUseCase<UpdateVideoPrivacyDTO,Video>{}