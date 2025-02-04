import express from "express"
import { AuthController } from "../../application/controllers/authController"


const authRoutes = express.Router()
authRoutes.post("/signup",AuthController.signup)
authRoutes.get("/signin",AuthController.signin)
authRoutes.get("/verifyOtp",AuthController.verifyOtp)
authRoutes.get("/resendOtp",AuthController.ResendOtp)


export default authRoutes


