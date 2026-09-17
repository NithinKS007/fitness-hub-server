import {
  GetTrainerVideoCallLogQueryDTO,
  GetUserVideoCallLogQueryDTO,
} from "@application/dtos/query-dtos";
import { IBaseUseCase } from "./IBase.UC";
import {
  CreateVideoCallLogDTO,
  TrainerVideoCallLog,
  UpdateVideoCallDurationDTO,
  UpdateVideoCallLogDTO,
  UserVideoCallLog,
} from "@application/dtos/video-call-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { VideoCallLog } from "@domain/entities/video-calllog.entity";

export interface IGetTrainerVideoCallLogUC
  extends IBaseUseCase<
    GetTrainerVideoCallLogQueryDTO,
    {
      trainerVideoCallLogList: TrainerVideoCallLog[];
      paginationData: PaginationDTO;
    }
  > {}
export interface IGetUserVideoCallLogUC
  extends IBaseUseCase<
    GetUserVideoCallLogQueryDTO,
    {
      userVideoCallLogList: UserVideoCallLog[];
      paginationData: PaginationDTO;
    }
  > {}
export interface ICreateVideoCallLogUC
  extends IBaseUseCase<CreateVideoCallLogDTO, void> {}
export interface IUpdateVideoCallDurationUC
  extends IBaseUseCase<UpdateVideoCallDurationDTO, VideoCallLog> {}
export interface IUpdateVideoCallStatusUC
  extends IBaseUseCase<UpdateVideoCallLogDTO, VideoCallLog> {}
