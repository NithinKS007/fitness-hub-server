import { OtpDTO } from "@application/dtos/auth-dtos";
import { Otp } from "@domain/entities/otp.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IOtpRepository extends IBaseRepository<Otp> {
  create(createOTP: OtpDTO): Promise<Otp>;
}
