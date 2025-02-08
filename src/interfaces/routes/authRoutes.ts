import express from "express"
import { AuthController } from "../../application/controllers/authController"


const authRoutes = express.Router()
authRoutes.post("/sign-up", AuthController.signup);  
authRoutes.post("/sign-in", AuthController.signin); 
authRoutes.post("/verify-otp", AuthController.verifyOtp); 
authRoutes.post("/resend-otp",AuthController.resendOtp)
authRoutes.post("/forgot-password", AuthController.generatePassResetLink)
authRoutes.patch("/forgot-password/:token", AuthController.forgotPassword);
authRoutes.post("/google",AuthController.createGoogleUser)

export default authRoutes


