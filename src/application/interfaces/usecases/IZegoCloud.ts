import { GenerateToken } from "@application/dtos/service/video-call.service";
import { IBaseUseCase } from "./IBase.UC";

export interface IZegoCloudCreateTokenUC
  extends IBaseUseCase<GenerateToken, { token: string; roomId: string ,appId:number}> {}
