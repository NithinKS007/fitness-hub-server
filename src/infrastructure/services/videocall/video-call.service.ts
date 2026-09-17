import {
  GenerateToken,
  KPrivilegeKey,
  KPrivilegeVal,
} from "@application/dtos/service/video-call.service";
import { IVideoCallService } from "@application/interfaces/services/videocall/IVideocall.service";
import {
  generateToken04,
  ZEGO_APP_ID,
  ZEGO_SERVER_SECRET,
} from "@infrastructure/config/zego-cloud.config";
import { validationError } from "@presentation/middlewares/error.middleware";
import { injectable } from "inversify";

@injectable()
export class VideoCallService implements IVideoCallService {
  async createToken({
    userId,
    roomId,
    expiry = 3600,
  }: GenerateToken): Promise<{ token: string; appId: number }> {
    const payload = JSON.stringify({
      room_id: roomId,
      privilege: {
        [KPrivilegeKey.PrivilegeKeyLogin]: KPrivilegeVal.PrivilegeEnable,
        [KPrivilegeKey.PrivilegeKeyPublish]: KPrivilegeVal.PrivilegeEnable,
      },
      stream_id_list: null,
    });

    const token = generateToken04(
      ZEGO_APP_ID,
      userId,
      ZEGO_SERVER_SECRET,
      expiry,
      payload
    );

    if (!token.startsWith("04")) {
      throw new validationError("Token must start with 04");
    }
    console.log(`Token created ${token} video call`);
    return { token: token, appId: ZEGO_APP_ID };
  }
}
