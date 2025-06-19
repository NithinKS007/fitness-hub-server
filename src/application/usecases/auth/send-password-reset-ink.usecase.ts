import { CreatePassResetTokenDTO } from "@application/dtos/auth-dtos";
import { AuthStatus } from "@shared/constants/index.constants";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IPasswordResetRepository } from "@domain/interfaces/IPasswordResetTokenRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IEmailService } from "@application/interfaces/communication/IEmail.service";
import { IHashService } from "@application/interfaces/security/IHash.service";
import { IPasswordResetToken } from "@domain/entities/pass-reset-token.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";
import { TYPES_SERVICES } from "di/types-services";

@injectable()
export class SendPasswordRestLinkUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.PasswordResetRepository)
    private passwordResetRepository: IPasswordResetRepository,
    @inject(TYPES_SERVICES.EmailService) private emailService: IEmailService,
    @inject(TYPES_SERVICES.HashService) private hashService: IHashService
  ) {}

  async execute({
    email,
  }: CreatePassResetTokenDTO): Promise<IPasswordResetToken> {
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
    const token = await this.hashService.generate();
    const hashedToken = await this.hashService.hash(token);

    const productionUrl = process.env.CLIENT_ORIGINS;
    const resetURL = `${productionUrl}/auth/reset-password/${token}`;
    const subject = "Password Reset";
    const text =
      `You are receiving this because you (or someone else) have requested the reset of the 
       password for your account.\n\n` +
      `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
      `${resetURL}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.`;

    const [tokenData, _] = await Promise.all([
      this.passwordResetRepository.createToken({
        email,
        resetToken: hashedToken,
      }),
      this.emailService.sendEmail({ to: email, subject, text }),
    ]);

    return tokenData;
  }
}
