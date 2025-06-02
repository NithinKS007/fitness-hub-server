import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { Otp } from "../../../domain/entities/otp.entities";
import { OtpDTO } from "../../dtos/auth-dtos";
import { OTPStatus } from "../../../shared/constants/index.constants";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { IEmailService } from "../../interfaces/communication/IEmail.service";
import { IOTPService } from "../../interfaces/security/IGenerate-otp.service";

/*  
    Method  : createOtp
    Purpose : Creates a new OTP and stores it in the repository for the provided email.
    Incoming: { email, otp } (email: string, otp: string) - The email address and the OTP value to be stored.
    Returns : { Otp } (Otp entity) - The OTP entity that was created and stored in the database.
    Throws  : validationError - If creating OTP fails due to invalid inputs or database issues.
*/

/*  
    Method: verifyOtpByEmail
    Purpose:
    Verifies the OTP associated with the provided email.
    Incoming:
        - { email, otp } (email: string, otp: string) - The email address and OTP to verify.
    Returns:
        - { void } (No return value. It updates the user’s verification status if successful.)
    Throws:
        - validationError: If the OTP is invalid or no OTP is found for the given email.
*/

/*  
    Method: resendOtp
    Purpose:
    Resends the OTP to the provided email if the user has not already been verified.
    Incoming:
        - { email, otp } (email: string, otp: string) - The email address and OTP to resend.
    Returns:
        - { void } (No return value. The OTP will be resent to the user's email.)
    Throws:
        - validationError: If the user is already verified, or any issue occurs while sending the OTP.
*/

export class OtpUseCase {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private otpService: IOTPService
  ) {}

  async createOtp({ email, otp }: OtpDTO): Promise<Otp> {
    return await this.otpRepository.createOtp({ email, otp });
  }
  async verifyOtpByEmail({ email, otp }: OtpDTO): Promise<void> {
    const otpData = await this.otpRepository.verifyOtpByEmail({ email, otp });

    if (!otpData) {
      throw new validationError(OTPStatus.InvalidOtp);
    }
    const { email: userEmail } = otpData;
    await this.userRepository.updateUserVerificationStatus({
      email: userEmail,
    });
    await this.otpRepository.deleteOtp(otpData);
  }
  async resendOtp({ email, otp }: OtpDTO): Promise<void> {
    const userData = await this.userRepository.findByEmail({ email });

    if (userData?.otpVerified) {
      throw new validationError(OTPStatus.AlreadyUserVerifiedByOtp);
    }
    const otpData = this.otpService.generateOtp(6);
    await this.otpRepository.createOtp({ email, otp: otpData });
    await this.emailService.sendEmail({
      to: email,
      subject: "OTP for Registration",
      text: `Your OTP is ${otp}. Please do not share this OTP with anyone.`,
    });
  }
}
