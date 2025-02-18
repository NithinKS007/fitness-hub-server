import { PassResetTokenDTO,PasswordResetDTO} from "../../application/dtos";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { UserRepository } from "../interfaces/userRepository";
import { PasswordResetRepository } from "../interfaces/passwordResetTokenRepository";
import { sendEmail } from "../../infrastructure/services/emailService";
import { PassResetTokenEntity } from "../entities/passResetTokenEntity";
import { hashToken, generateToken} from "../../shared/utils/generateToken";
import { hashPassword } from "../../shared/utils/hashPassword";

export class ForgotPasswordUseCase {
  constructor(private userRepository: UserRepository,private passwordResetRepository:PasswordResetRepository ) {}

  public async generatePassResetLink(data: PassResetTokenDTO): Promise<PassResetTokenEntity> {
    const { email } = data;
    const userData = await this.userRepository.findUserByEmail({email: email});
    if (!userData) {
      throw new Error(HttpStatusMessages.EmailNotFound);
    }
    if(userData.googleVerified){
      throw new Error(HttpStatusMessages.DifferentLoginMethod)
    }
    if (userData && !userData.otpVerified) {
      throw new Error(HttpStatusMessages.AccountNotVerified);
    }
    const token = await generateToken();
    const hashedToken = await hashToken(token)

    const tokenData =  await this.passwordResetRepository.createToken({email,resetToken:hashedToken})
    const productionUrl = `http://localhost:3000`;
    const resetURL = `${productionUrl}/auth/reset-password/${token}`;
    const subject = "Password Reset";
    const text =
      `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
      `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
      `${resetURL}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.`;

    await sendEmail(email, subject, text)
    return tokenData;
  }
  public async forgotPassword(data: PasswordResetDTO): Promise<void> {
    const {resetToken, password } = data
    const token = await hashToken(resetToken)
    const tokenData = await this.passwordResetRepository.verifyToken({resetToken:token})

    if(!tokenData) {
       throw new Error(HttpStatusMessages.LinkExpired)
    }
    const { email } = tokenData
    const userData = await this.userRepository.findUserByEmail({email})
    if(!userData){
      throw new Error(HttpStatusMessages.EmailNotFound)
    }
    const hashedPassword = await hashPassword(password as string)
    await this.userRepository.forgotPassword({email,password:hashedPassword})
  }
  
}
