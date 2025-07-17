import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { StatusCodes } from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";
import { TYPES_VIDEO_CALL_USECASES } from "@di/types-usecases";
import { VideoCallStatus } from "@shared/constants/videocallStatus/videocall.status";
import { IZegoCloudCreateTokenUC } from "@application/interfaces/usecases/IZegoCloud";

@injectable()
export class ZegoCloudTokenController {
  constructor(
    @inject(TYPES_VIDEO_CALL_USECASES.ZegoCloudCreateTokenUC)
    private createTokenUseCase: IZegoCloudCreateTokenUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { _id: currentuserId } = req?.user || {};
    const { token, roomId, appId } = await this.createTokenUseCase.execute({
      userId: currentuserId,
    });

    sendResponse(
      res,
      StatusCodes.OK,
      { token: token, roomId: roomId, appId: appId },
      VideoCallStatus.TokenCreatedSuccess
    );
  }
}
