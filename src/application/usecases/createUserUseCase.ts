import { UserRepository } from "../../domain/interfaces/userRepository";
import { OtpRepository } from "../../domain/interfaces/otpRepository";
import { User } from "../../domain/entities/userEntity";
import { CreateUserDTO } from "../dtos/userDTOs";
import { hashPassword } from "../../shared/utils/hashPassword";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendEmail } from "../../infrastructure/services/emailService";
import generateOtp from "../../shared/utils/otpGenerator";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private otpRepository: OtpRepository
  ) {}
  public async create(data: CreateUserDTO): Promise<User> {
    const { fname, lname, email, password } = data;

    if (!fname || !lname || !email || !password) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    const existinguser = await this.userRepository.findByEmail({
      email: email,
    });
    if (existinguser && existinguser.otpVerified) {
      throw new validationError(HttpStatusMessages.EmailConflict);
    }
    if (
      existinguser &&
      !existinguser.otpVerified &&
      existinguser.googleVerified
    ) {
      throw new validationError(HttpStatusMessages.DifferentLoginMethod);
    }
    if (existinguser && !existinguser.otpVerified) {
      const otp = generateOtp(6);
      await this.otpRepository.createOtp({ email, otp });
      await sendEmail(
        email,
        "OTP for Registration",
        `Your OTP is ${otp}. Please do not share this OTP with anyone.`
      );
      return existinguser;
    }

    const hashedPassword = await hashPassword(password);
    const userData = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    const otp = generateOtp(6);
    console.log("otp generated for user registeration",otp)
    await this.otpRepository.createOtp({ email, otp });
    await sendEmail(
      email,
      "OTP for Registration",
      `Your OTP is ${otp}. Please do not share this OTP with anyone.`
    );
    return userData;
  }
}
