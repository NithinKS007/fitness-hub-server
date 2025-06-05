import {
  CreateVideoCallLogDTO,
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
} from "../../application/dtos/video-call-dtos";
import { GetVideoCallLogQueryDTO } from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import {
  TrainerVideoCallLog,
  UserVideoCallLog,
  VideoCallLog,
} from "../entities/video-calllog.entities";
import { IBaseRepository } from "./IBaseRepository";
import { IVideoCallLog } from "../../infrastructure/databases/models/video-call-log.model";

export interface IVideoCallLogRepository extends IBaseRepository<IVideoCallLog> {
  updateVideoCallLog(data: UpdateVideoCallLogDTO): Promise<VideoCallLog|null>;
  updateVideoCallDuration(data: UpdateVideoCallDurationDTO): Promise<void>;
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
