import express from "express"
import { authenticate } from "../middlewares/authenticate";
import expressAsyncHandler from "express-async-handler";
import { adminController, adminDashboardController } from "../../di/di";

const adminRoutes = express.Router()

//USER MANAGEMENT ROUTES
adminRoutes.get("/users",authenticate,expressAsyncHandler(adminController.getUsers))
adminRoutes.get("/users/:userId",authenticate,expressAsyncHandler(adminController.getUserDetails))
adminRoutes.patch("/users/:userId",authenticate,expressAsyncHandler(adminController.updateBlockStatus))

//TRAINER MANAGEMENT ROUTES
adminRoutes.get("/trainers",authenticate,expressAsyncHandler(adminController.getTrainers))
adminRoutes.get("/trainers/:trainerId",authenticate,expressAsyncHandler(adminController.getTrainerDetails))
adminRoutes.get("/pending-approval",authenticate,expressAsyncHandler(adminController.getPendingList))
adminRoutes.patch("/pending-approval/:trainerId",authenticate, expressAsyncHandler(adminController.handleVerification))
adminRoutes.get("/trainer/subscriptions/:trainerId",authenticate, expressAsyncHandler(adminController.getTrainerSubscriptions))

//DASHBOARD MANAGEMENT ROUTES
adminRoutes.get("/dashboard",authenticate,expressAsyncHandler(adminDashboardController.getAdminDashBoardData))

//REVENUE MANAGEMENT ROUTES
adminRoutes.get("/revenue",authenticate,expressAsyncHandler(adminController.getAdminRevenueHistory))

export default adminRoutes
