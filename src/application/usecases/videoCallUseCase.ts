import { VideoCallLog } from "../../domain/entities/videoCallLogEntity";
import { VideoCallLogRepository } from "../../domain/interfaces/videoCallLogRepository";
import { CreateVideoCallLogDTO,UpdateVideoCallLogDTO,UpdateVideoCallDurationDTO } from "../dtos/chatDTOs";

export class VideoCallUseCase {
    constructor(private videoCallLogRepository:VideoCallLogRepository){}
    public async createVideoCallLog(data:CreateVideoCallLogDTO):Promise<void> {
      await this.videoCallLogRepository.createCallLog(data)
    }
    public async updateVideoCallLog(data:UpdateVideoCallLogDTO):Promise<VideoCallLog>{
     return await this.videoCallLogRepository.updateVideoCallLog(data)
    }
    public async updateVideoCallDuration(data:UpdateVideoCallDurationDTO):Promise<void> {
      await this.videoCallLogRepository.updateVideoCallDuration(data)
    }
}