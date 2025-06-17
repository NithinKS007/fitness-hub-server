import { OtpDTO } from "@application/dtos/auth-dtos";
import { IOtp } from "@domain/entities/otp.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IOtpRepository extends IBaseRepository<IOtp> {
  create(createOTP: OtpDTO): Promise<IOtp>;
}
