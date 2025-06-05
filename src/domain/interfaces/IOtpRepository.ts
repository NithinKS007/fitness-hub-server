import { OtpDTO } from "../../application/dtos/auth-dtos";
import { IOtp } from "../../infrastructure/databases/models/otp.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IOtpRepository extends IBaseRepository<IOtp> {
  create(createOTP: OtpDTO): Promise<IOtp>;
}
