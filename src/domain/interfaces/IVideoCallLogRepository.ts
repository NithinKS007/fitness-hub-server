import {
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
  TrainerVideoCallLog,
  UserVideoCallLog,
} from "@application/dtos/video-call-dtos";
import { GetVideoCallLogQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IVideoCallLog } from "@domain/entities/video-calllog.entity";

export interface IVideoCallLogRepository
  extends IBaseRepository<IVideoCallLog> {
  updateStatus(data: UpdateVideoCallLogDTO): Promise<IVideoCallLog | null>;
  updateDuration(data: UpdateVideoCallDurationDTO): Promise<void>;
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
