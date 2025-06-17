import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import {
  googleAuthController,
  otpController,
  signUpUserController,
  signUpTrainerController,
  passwordResetLinkController,
  forgotPasswordController,
  changePasswordController,
  signInController,
  refreshAccessTokenController,
  signOutController,
} from "../../di/di";
import { asyncHandler } from "@shared/utils/async-handler";

const authRoutes = express.Router();

//REGISTRATION AND SIGNIN ROUTES
authRoutes.post(
  "/sign-up",
  asyncHandler(signUpUserController.handleSignUpUser.bind(signUpUserController))
);
authRoutes.post(
  "/trainer-sign-up",
  asyncHandler(
    signUpTrainerController.handleSignUpTrainer.bind(signUpTrainerController)
  )
);
authRoutes.post(
  "/google",
  asyncHandler(
    googleAuthController.handleGoogleLogin.bind(googleAuthController)
  )
);
authRoutes.post(
  "/sign-in",
  asyncHandler(signInController.handleSignin.bind(signInController))
);

//OTP ROUTES
authRoutes.post(
  "/otp/verify",
  asyncHandler(otpController.verifyOtp.bind(otpController))
);
authRoutes.post(
  "/otp/resend",
  asyncHandler(otpController.resendOtp.bind(otpController))
);

//PASSWORD ROUTES
authRoutes.post(
  "/password-reset",
  asyncHandler(
    passwordResetLinkController.handleResetLink.bind(
      passwordResetLinkController
    )
  )
);
authRoutes.patch(
  "/password-reset/:token",
  asyncHandler(
    forgotPasswordController.handleForgotPassword.bind(forgotPasswordController)
  )
);
authRoutes.patch(
  "/password/change",
  authenticate,
  asyncHandler(
    changePasswordController.handleChangePassword.bind(changePasswordController)
  )
);

//AUTHENTICATION AND SIGNOUT ROUTES
authRoutes.post(
  "/refresh-token",
  asyncHandler(
    refreshAccessTokenController.handleRefreshAccessToken.bind(
      refreshAccessTokenController
    )
  )
);
authRoutes.post(
  "/sign-out",
  asyncHandler(signOutController.handleSignOut.bind(signOutController))
);

export default authRoutes;
