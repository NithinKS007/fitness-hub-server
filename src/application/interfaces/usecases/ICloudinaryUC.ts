import { IBaseUseCase } from "./IBase.UC";
import { UploadSignature } from "@application/dtos/service/cloud.storage.service";

export interface ICloudinarySigUC
  extends IBaseUseCase<{ folder: string; id: string }, UploadSignature> {}
