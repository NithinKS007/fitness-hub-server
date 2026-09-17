import {
  GetTrainerVideoCallLogDTO,
  GetUserVideoCallLogDTO,
} from "@application/dtos/query-dtos";
import { IBaseUseCase } from "./IBase.UC";
import {
  CreateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
  UpdateVideoCallLogDTO,
} from "@application/dtos/video-call-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { VideoCallLog } from "@domain/entities/video-calllog.entity";
import {
  TRCallLogUILayer,
  URCallLogUILayer,
} from "@infrastructure/mappers/call-log.mapper";

export interface IGetTrainerVideoCallLogUC
  extends IBaseUseCase<
    GetTrainerVideoCallLogDTO,
    {
      trainerVideoCallLogList: TRCallLogUILayer[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetUserVideoCallLogUC
  extends IBaseUseCase<
    GetUserVideoCallLogDTO,
    {
      userVideoCallLogList: URCallLogUILayer[];
      paginationData: PaginationDTO;
    }
  > {}
export interface ICreateVideoCallLogUC
  extends IBaseUseCase<CreateVideoCallLogDTO, void> {}
export interface IUpdateVideoCallDurationUC
  extends IBaseUseCase<UpdateVideoCallDurationDTO, VideoCallLog> {}
export interface IUpdateVideoCallStatusUC
  extends IBaseUseCase<UpdateVideoCallLogDTO, VideoCallLog> {}
