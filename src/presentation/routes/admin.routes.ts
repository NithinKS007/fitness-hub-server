import express from "express"
import { authenticate } from "../middlewares/auth.middleware";
import expressAsyncHandler from "express-async-handler";
import {
  adminDashboardController,
  getUserController,
  updateUserBlockStatusController,
  getallTrainersController,
  getTrainerDetailsController,
  trainerSubscriptionController,
  getVerifyTrainerController,
  verifyTrainerController,
  getPlatformEarningsController
} from "../../di/di";

const adminRoutes = express.Router()

//USER MANAGEMENT ROUTES
adminRoutes.get("/users",authenticate,expressAsyncHandler(getUserController.getUsers.bind(getUserController)))
adminRoutes.get("/users/:userId",authenticate,expressAsyncHandler(getUserController.getUserDetails.bind(getUserController)))
adminRoutes.patch("/users/:userId",authenticate,expressAsyncHandler(updateUserBlockStatusController.updateBlockStatus.bind(updateUserBlockStatusController)))

//TRAINER MANAGEMENT ROUTES
adminRoutes.get("/trainers",authenticate,expressAsyncHandler(getallTrainersController.getTrainers.bind(getallTrainersController)))
adminRoutes.get("/trainers/:trainerId",authenticate,expressAsyncHandler(getTrainerDetailsController.getTrainerDetails.bind(getTrainerDetailsController)))
adminRoutes.get("/pending-approval",authenticate,expressAsyncHandler(getVerifyTrainerController.getVerifyPendingList.bind(getVerifyTrainerController)))
adminRoutes.patch("/pending-approval/:trainerId",authenticate, expressAsyncHandler(verifyTrainerController.handleVerification.bind(verifyTrainerController)))
adminRoutes.get("/trainer/subscriptions/:trainerId",authenticate, expressAsyncHandler(trainerSubscriptionController.getTrainerSubscriptions.bind(trainerSubscriptionController)))

//DASHBOARD MANAGEMENT ROUTES
adminRoutes.get("/dashboard",authenticate,expressAsyncHandler(adminDashboardController.getAdminDashBoardData.bind(adminDashboardController)))

//REVENUE MANAGEMENT ROUTES
adminRoutes.get("/revenue",authenticate,expressAsyncHandler(getPlatformEarningsController.getPlatformEarnings.bind(getPlatformEarningsController)))

export default adminRoutes
