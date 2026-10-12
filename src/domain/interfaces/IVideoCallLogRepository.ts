import {
  GetTrainerVideoCallLogDTO,
  GetUserVideoCallLogDTO,
} from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { VideoCallLog } from "@domain/entities/video-calllog.entity";
import {
  TRCallLogUILayer,
  URCallLogUILayer,
} from "@application/dtos/read-models";

export interface IVideoCallLogRepository
  extends IBaseRepository<VideoCallLog> {
  getTrainerVideoCallLogs(
    dtos: GetTrainerVideoCallLogDTO
  ): Promise<PagedResponse<TRCallLogUILayer>>;
  getUserVideoCallLogs(
    dtos: GetUserVideoCallLogDTO
  ): Promise<PagedResponse<URCallLogUILayer>>;
}
