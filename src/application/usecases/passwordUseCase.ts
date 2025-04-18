import {
  ChangePasswordDTO,
  CreatePassResetTokenDTO,
  PasswordResetDTO,
} from "../dtos/authDTOs";
import { AuthenticationStatusMessage, PasswordStatusMessage } from "../../shared/constants/httpResponseStructure";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { IPasswordResetRepository } from "../../domain/interfaces/IPasswordResetTokenRepository";
import { sendEmail } from "../../infrastructure/services/emailService";
import { PassResetTokenEntity } from "../../domain/entities/passResetTokenEntity";
import { hashToken, generateToken } from "../../shared/utils/generateToken";
import { comparePassword, hashPassword } from "../../shared/utils/hashPassword";
import { validationError } from "../../presentation/middlewares/errorMiddleWare";

export class PasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordResetRepository: IPasswordResetRepository
  ) {}

  public async generatePassResetLink({
    email,
    resetToken,
  }: CreatePassResetTokenDTO): Promise<PassResetTokenEntity> {
    const userData = await this.userRepository.findByEmail({ email: email });
    if (!userData) {
      throw new validationError(AuthenticationStatusMessage.EmailNotFound);
    }
    if (userData.googleVerified) {
      throw new validationError(AuthenticationStatusMessage.DifferentLoginMethod);
    }
    if (userData && !userData.otpVerified) {
      throw new validationError(AuthenticationStatusMessage.AccountNotVerified);
    }
    const token = await generateToken();
    const hashedToken = await hashToken(token);

    const tokenData = await this.passwordResetRepository.createToken({
      email,
      resetToken: hashedToken,
    });
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
  public async forgotPassword({
    resetToken,
    password,
  }: PasswordResetDTO): Promise<void> {
    const token = await hashToken(resetToken);
    const tokenData = await this.passwordResetRepository.verifyToken({
      resetToken: token,
    });

    if (!tokenData) {
      throw new validationError(PasswordStatusMessage.LinkExpired);
    }
    const { email } = tokenData;
    const userData = await this.userRepository.findByEmail({ email });
    if (!userData) {
      throw new validationError(AuthenticationStatusMessage.EmailNotFound);
    }
    const hashedPassword = await hashPassword(password as string);
    await this.userRepository.forgotPassword({
      email,
      password: hashedPassword,
    });
  }

  public async changePassword({
    userId,
    newPassword,
    password,
  }: ChangePasswordDTO): Promise<void> {
    if (!userId || !newPassword || !password) {
      throw new validationError(AuthenticationStatusMessage.AllFieldsAreRequired);
    }
    const userData = await this.userRepository.findById(userId);
    if (!userData) {
      throw new validationError(AuthenticationStatusMessage.InvalidId);
    }
    const isValidPassword = await comparePassword(password, userData.password);

    if (!isValidPassword) {
      throw new validationError(PasswordStatusMessage.IncorrectPassword);
    }
    const hashedPassword = await hashPassword(newPassword);
    await this.userRepository.changePassword({
      userId,
      newPassword: hashedPassword,
      password,
    });
  }
}
