import { OtpDTO } from "@application/dtos/auth-dtos";
import { Otp } from "@domain/entities/otp.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IOtp } from "@infrastructure/databases/models/otp.model";

export interface IOtpRepository extends IBaseRepository<IOtp, Otp> {
  create(createOTP: OtpDTO): Promise<Otp>;
}
