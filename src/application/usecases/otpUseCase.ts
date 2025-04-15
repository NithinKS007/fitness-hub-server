import { IOtpRepository } from "../../domain/interfaces/IOtpRepository";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { Otp } from "../../domain/entities/otpEntity";
import { OtpDTO } from "../dtos/authDTOs";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendEmail } from "../../infrastructure/services/emailService";
import generateOtp from "../../shared/utils/otpGenerator";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";

export class OtpUseCase {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IUserRepository
  ) {}

  public async createOtp({ email, otp }: OtpDTO): Promise<Otp> {
    return await this.otpRepository.createOtp({ email, otp });
  }
  public async verifyOtpByEmail({ email, otp }: OtpDTO): Promise<void> {
    const otpData = await this.otpRepository.verifyOtpByEmail({ email, otp });

    if (!otpData) {
      throw new validationError(HttpStatusMessages.InvalidOtp);
    }
    const { email: userEmail } = otpData;
    await this.userRepository.updateUserVerificationStatus({
      email: userEmail,
    });
    await this.otpRepository.deleteOtp(otpData);
  }
  public async resendOtp({ email, otp }: OtpDTO): Promise<void> {
    const userData = await this.userRepository.findByEmail({ email });

    if (userData?.otpVerified) {
      throw new validationError(HttpStatusMessages.AlreadyUserVerifiedByOtp);
    }
    const otpData = generateOtp(6);
    await this.otpRepository.createOtp({ email, otp: otpData });
    await sendEmail(
      email,
      "OTP for Registration",
      `Your OTP is ${otp}. Please do not share this OTP with anyone.`
    );
  }
}
