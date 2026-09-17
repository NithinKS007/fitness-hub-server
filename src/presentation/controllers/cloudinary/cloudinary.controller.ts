import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import {
  ApplicationStatus,
  StatusCodes,
} from "@shared/constants/index.constants";
import { TYPES_CLOUDINARY_USECASES } from "@di/types-usecases";
import { parseQueryParams } from "@shared/utils/parse-query-params";
import { ICloudinarySigUC } from "@application/interfaces/usecases/ICloudinaryUC";

@injectable()
export class CloudinaryController {
  constructor(
    @inject(TYPES_CLOUDINARY_USECASES.CloudinarySigUseCase)
    private CloudinaryUseCase: ICloudinarySigUC
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { folder } = parseQueryParams(req.query);
    const { _id } = req?.user || {};
    const signatureData = await this.CloudinaryUseCase.execute({
      folder,
      id: _id,
    });
    sendResponse(
      res,
      StatusCodes.OK,
      signatureData,
      ApplicationStatus.SignatureSuccess
    );
  }
}
