import { changePasswordDTO,PassResetTokenDTO,PasswordResetDTO } from "../dtos/authDTOs";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { PasswordResetRepository } from "../../domain/interfaces/passwordResetTokenRepository";
import { sendEmail } from "../../infrastructure/services/emailService";
import { PassResetTokenEntity } from "../../domain/entities/passResetTokenEntity";
import { hashToken, generateToken } from "../../shared/utils/generateToken";
import { comparePassword, hashPassword } from "../../shared/utils/hashPassword";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";

export class PasswordUseCase {
  constructor(private userRepository: UserRepository,private passwordResetRepository: PasswordResetRepository) {}

  public async generatePassResetLink(data: PassResetTokenDTO): Promise<PassResetTokenEntity> {
    const { email } = data;
    const userData = await this.userRepository.findByEmail({ email: email });
    if (!userData) {
      throw new validationError(HttpStatusMessages.EmailNotFound);
    }
    if (userData.googleVerified) {
      throw new validationError(HttpStatusMessages.DifferentLoginMethod);
    }
    if (userData && !userData.otpVerified) {
      throw new validationError(HttpStatusMessages.AccountNotVerified);
    }
    const token = await generateToken();
    const hashedToken = await hashToken(token);

    const tokenData = await this.passwordResetRepository.createToken({email,resetToken: hashedToken});
    const productionUrl = process.env.CLIENT_ORIGINS;
    const resetURL = `${productionUrl}/auth/reset-password/${token}`;
    const subject = "Password Reset";
    const text =
      `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
      `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
      `${resetURL}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.`;

    await sendEmail(email, subject, text);
    return tokenData;
  }
  public async forgotPassword(data: PasswordResetDTO): Promise<void> {
    const { resetToken, password } = data;
    const token = await hashToken(resetToken);
    const tokenData = await this.passwordResetRepository.verifyToken({
      resetToken: token,
    });

    if (!tokenData) {
      throw new validationError(HttpStatusMessages.LinkExpired);
    }
    const { email } = tokenData;
    const userData = await this.userRepository.findByEmail({ email });
    if (!userData) {
      throw new validationError(HttpStatusMessages.EmailNotFound);
    }
    const hashedPassword = await hashPassword(password as string);
    await this.userRepository.forgotPassword({
      email,
      password: hashedPassword,
    });
  }

  public async changePassword(data: changePasswordDTO): Promise<void> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const userData = await this.userRepository.findById(data._id);
    if (!userData) {
      throw new validationError(HttpStatusMessages.InvalidId);
    }
    const isValidPassword = await comparePassword(
      data.password,
      userData.password
    );

    if (!isValidPassword) {
      throw new validationError(HttpStatusMessages.IncorrectPassword);
    }
    const hashedPassword = await hashPassword(data.newPassword);
    data.newPassword = hashedPassword;
    await this.userRepository.changePassword(data);
  }
}
