import {
  ChangePasswordDTO,
  CreatePassResetTokenDTO,
  PasswordResetDTO,
} from "../../dtos/auth-dtos";
import {
  ApplicationStatus,
  AuthStatus,
  PasswordStatus,
} from "../../../shared/constants/index.constants";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IPasswordResetRepository } from "../../../domain/interfaces/IPasswordResetTokenRepository";
import { PassResetTokenEntity } from "../../../domain/entities/pass-reset-token.entities";
import { validationError } from "../../../presentation/middlewares/error.middleware";
import { IEmailService } from "../../interfaces/communication/IEmail.service";
import { IPasswordService } from "../../interfaces/security/IPassword.service";
import { ITokenService } from "../../interfaces/security/IToken.service";

export class PasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordResetRepository: IPasswordResetRepository,
    private emailService: IEmailService,
    private passwordService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async generateResetLink({
    email,
  }: CreatePassResetTokenDTO): Promise<PassResetTokenEntity> {
    const userData = await this.userRepository.findOne({ email: email });
    if (!userData) {
      throw new validationError(AuthStatus.EmailNotFound);
    }
    if (userData.googleVerified) {
      throw new validationError(AuthStatus.DifferentLoginMethod);
    }
    if (userData && !userData.otpVerified) {
      throw new validationError(AuthStatus.AccountNotVerified);
    }
    const token = await this.tokenService.generateToken();
    const hashedToken = await this.tokenService.hashToken(token);

    const productionUrl = process.env.CLIENT_ORIGINS;
    const resetURL = `${productionUrl}/auth/reset-password/${token}`;
    const subject = "Password Reset";
    const text =
      `You are receiving this because you (or someone else) have requested the reset of the 
       password for your account.\n\n` +
      `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
      `${resetURL}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.`;

    const [tokenData, emailData] = await Promise.all([
      this.passwordResetRepository.createToken({
        email,
        resetToken: hashedToken,
      }),
      this.emailService.sendEmail({ to: email, subject, text }),
    ]);

    return tokenData;
  }
  async forgotPassword({
    resetToken,
    password,
  }: PasswordResetDTO): Promise<void> {
    const token = await this.tokenService.hashToken(resetToken);
    const tokenData = await this.passwordResetRepository.findOne({
      resetToken: token,
    });

    if (!tokenData) {
      throw new validationError(PasswordStatus.LinkExpired);
    }
    const { email } = tokenData;
    const userData = await this.userRepository.findOne({ email });
    if (!userData) {
      throw new validationError(AuthStatus.EmailNotFound);
    }
    if (password) {
      const hashedPassword = await this.passwordService.hashPassword(password);
      await this.userRepository.forgotPassword({
        email,
        password: hashedPassword,
      });
    }
  }

  async changePassword({
    userId,
    newPassword,
    password,
  }: ChangePasswordDTO): Promise<void> {
    if (!userId || !newPassword || !password) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const userData = await this.userRepository.findById(userId);
    if (!userData) {
      throw new validationError(AuthStatus.InvalidId);
    }
    const isValidPassword = await this.passwordService.comparePassword(
      password,
      userData.password
    );

    if (!isValidPassword) {
      throw new validationError(PasswordStatus.IncorrectPassword);
    }
    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }
}
