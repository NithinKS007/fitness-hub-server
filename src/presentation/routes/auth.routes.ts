import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  changePasswordController,
  forgotPasswordController,
  googleAuthController,
  otpController,
  passwordResetLinkController,
  refreshAccessTokenController,
  signInController,
  signOutController,
  signUpTrainerController,
  signUpUserController,
} from "@di/container-resolver";
import { signinSchema, userSchema } from "@presentation/middlewares/validation-schemas/user-schema";
import { validate } from "@presentation/middlewares/validation.middleware";
import { trainerSchema } from "@presentation/middlewares/validation-schemas/trainer-schema";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const authRoutes = express.Router();

//REGISTRATION AND SIGNIN ROUTES
authRoutes.post("/user/sign-up",userSchema,validate,asyncHandler(signUpUserController.handle.bind(signUpUserController)));
authRoutes.post("/trainer/sign-up",trainerSchema,validate, asyncHandler(signUpTrainerController.handle.bind(signUpTrainerController)));
authRoutes.post("/google",asyncHandler(googleAuthController.handle.bind(googleAuthController)));
authRoutes.post("/sign-in",signinSchema,validate,asyncHandler(signInController.handle.bind(signInController)));

//OTP ROUTES
authRoutes.post("/otp/verify",asyncHandler(otpController.verifyOtp.bind(otpController)));
authRoutes.post("/otp/resend",asyncHandler(otpController.resendOtp.bind(otpController)));

//PASSWORD ROUTES
authRoutes.post("/password-reset",asyncHandler(passwordResetLinkController.handle.bind(passwordResetLinkController)));
authRoutes.patch("/password-reset/:token",asyncHandler(forgotPasswordController.handle.bind(forgotPasswordController)));
authRoutes.patch("/password/change",authenticate,authorizeRole(["user","trainer","admin"]),asyncHandler(changePasswordController.handle.bind(changePasswordController)));

//AUTHENTICATION AND SIGNOUT ROUTES
authRoutes.post("/refresh-token",asyncHandler(refreshAccessTokenController.handle.bind(refreshAccessTokenController)));
authRoutes.post("/sign-out",asyncHandler(signOutController.handle.bind(signOutController)));

export default authRoutes;
