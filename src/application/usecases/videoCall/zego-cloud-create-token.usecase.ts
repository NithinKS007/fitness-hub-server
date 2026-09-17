import { GenerateToken } from "@application/dtos/service/video-call.service";
import { IVideoCallService } from "@application/interfaces/services/videocall/IVideocall.service";
import { IZegoCloudCreateTokenUC } from "@application/interfaces/usecases/IZegoCloud";
import { TYPES_SERVICES } from "@di/types-services";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";

injectable();
export class ZegoCloudCreateTokenUseCase implements IZegoCloudCreateTokenUC {
  constructor(
    @inject(TYPES_SERVICES.VideoCallService)
    private videoCallService: IVideoCallService
  ) {}
  async execute({
    userId,
  }: GenerateToken): Promise<{ token: string; roomId: string; appId: number }> {
    if (!userId) {
      throw new validationError("All fields to are required to create token");
    }

    const randomNum = Math.floor(Math.random() * 1000000);
    const roomId = randomNum;
    const expiry = 3600;
    const createTokenData = { userId, roomId, expiry };

    const { token, appId } = await this.videoCallService.createToken(
      createTokenData
    );

    if (!token) {
      throw new validationError("Failed to create token");
    }

    return { token, roomId: roomId.toString(), appId: appId };
  }
}
