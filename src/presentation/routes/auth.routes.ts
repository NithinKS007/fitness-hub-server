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
import { authRateLimiter } from "@presentation/middlewares/ratelimit.middleware";

const router = express.Router();

//REGISTRATION AND SIGNIN ROUTES
router.post("/auth/user/sign-up",authRateLimiter,userSchema,validate,asyncHandler(signUpUserController.handle.bind(signUpUserController)));
router.post("/auth/trainer/sign-up",authRateLimiter,trainerSchema,validate, asyncHandler(signUpTrainerController.handle.bind(signUpTrainerController)));
router.post("/auth/sign-in",authRateLimiter,signinSchema,validate,asyncHandler(signInController.handle.bind(signInController)));
router.post("/auth/google",authRateLimiter,asyncHandler(googleAuthController.handle.bind(googleAuthController)));

//OTP ROUTES
router.post("/auth/otp/verify",authRateLimiter,asyncHandler(otpController.verifyOtp.bind(otpController)));
router.post("/auth/otp/resend",authRateLimiter,asyncHandler(otpController.resendOtp.bind(otpController)));

//PASSWORD ROUTES
router.post("/auth/password-reset",authRateLimiter,asyncHandler(passwordResetLinkController.handle.bind(passwordResetLinkController)));
router.patch("/auth/password-reset/:token",authRateLimiter,asyncHandler(forgotPasswordController.handle.bind(forgotPasswordController)));
router.patch("/auth/password/change",authenticate,authorizeRole(["user","trainer","admin"]),asyncHandler(changePasswordController.handle.bind(changePasswordController)));

//AUTHENTICATION AND SIGNOUT ROUTES
router.post("/auth/refresh-token",asyncHandler(refreshAccessTokenController.handle.bind(refreshAccessTokenController)));
router.post("/auth/sign-out",asyncHandler(signOutController.handle.bind(signOutController)));

export default router;
