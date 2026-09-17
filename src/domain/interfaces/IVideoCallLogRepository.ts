import {
  GetTrainerVideoCallLogDTO,
  GetUserVideoCallLogDTO,
} from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { VideoCallLog } from "@domain/entities/video-calllog.entity";
import { IVideoCallLog } from "@infrastructure/databases/models/video-call-log.model";
import {
  TRCallLogUILayer,
  URCallLogUILayer,
} from "@infrastructure/mappers/call-log.mapper";

export interface IVideoCallLogRepository
  extends IBaseRepository<IVideoCallLog, VideoCallLog> {
  getTrainerVideoCallLogs(
    dtos: GetTrainerVideoCallLogDTO
  ): Promise<PagedResponse<TRCallLogUILayer>>;
  getUserVideoCallLogs(
    dtos: GetUserVideoCallLogDTO
  ): Promise<PagedResponse<URCallLogUILayer>>;
}
