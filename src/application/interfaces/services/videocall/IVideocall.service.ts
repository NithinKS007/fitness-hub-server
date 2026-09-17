import { GenerateToken } from "@application/dtos/service/video-call.service";

export interface IVideoCallService {
  createToken(dto: GenerateToken): Promise<{ token: string; appId: number }>;
}
