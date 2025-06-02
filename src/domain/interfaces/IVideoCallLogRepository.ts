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

export interface IVideoCallLogRepository {
  createCallLog(data: CreateVideoCallLogDTO): Promise<void>;
  updateVideoCallLog(data: UpdateVideoCallLogDTO): Promise<VideoCallLog>;
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
