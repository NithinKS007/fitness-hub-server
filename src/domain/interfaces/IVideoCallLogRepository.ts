import {
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
  TrainerVideoCallLog,
  UserVideoCallLog,
} from "@application/dtos/video-call-dtos";
import { GetVideoCallLogQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { VideoCallLog } from "@domain/entities/video-calllog.entity";
import { IVideoCallLog } from "@infrastructure/databases/models/video-call-log.model";

export interface IVideoCallLogRepository
  extends IBaseRepository<IVideoCallLog,VideoCallLog> {
  updateStatus(data: UpdateVideoCallLogDTO): Promise<VideoCallLog | null>;
  updateDuration(
    data: UpdateVideoCallDurationDTO
  ): Promise<VideoCallLog | null>;
  getTrainerVideoCallLogs(
    trainerId: string,
    videoCallLogQuery: GetVideoCallLogQueryDTO
  ): Promise<{
    trainerVideoCallLogList: TrainerVideoCallLog[];
    paginationData: PaginationDTO;
  }>;
  getUserVideoCallLogs(
    userId: string,
    videoCallLogQuery: GetVideoCallLogQueryDTO
  ): Promise<{
    userVideoCallLogList: UserVideoCallLog[];
    paginationData: PaginationDTO;
  }>;
}
