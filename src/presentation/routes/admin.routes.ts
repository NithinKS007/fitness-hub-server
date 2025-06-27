import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  adminDashboardController,
  getAllTrainersController,
  getPlatformEarningsController,
  getTrainerDetailsController,
  getTrainerSubscriptionController,
  getUserDetailsController,
  getUsersController,
  getVerifyTrainerController,
  updateUserBlockStatusController,
  verifyTrainerController,
} from "@di/container-resolver";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const adminRoutes = express.Router();
adminRoutes.use(authenticate);  
adminRoutes.use(authorizeRole(['admin']));

//USER MANAGEMENT ROUTES
adminRoutes.get("/users",asyncHandler(getUsersController.handle.bind(getUsersController)));
adminRoutes.get("/users/:userId",asyncHandler(getUserDetailsController.handle.bind(getUserDetailsController)));
adminRoutes.patch("/users/:userId",asyncHandler(updateUserBlockStatusController.handle.bind(updateUserBlockStatusController)));

//TRAINER MANAGEMENT ROUTES
adminRoutes.get("/trainers",asyncHandler(getAllTrainersController.handle.bind(getAllTrainersController)));
adminRoutes.get("/trainers/:trainerId",asyncHandler(getTrainerDetailsController.handle.bind(getTrainerDetailsController)));
adminRoutes.get("/trainers/approval",asyncHandler(getVerifyTrainerController.handle.bind(getVerifyTrainerController)));
adminRoutes.patch("/trainers/:trainerId/approval",asyncHandler(verifyTrainerController.handle.bind(verifyTrainerController)));
adminRoutes.get("/trainers/:trainerId/subscriptions",asyncHandler(getTrainerSubscriptionController.handle.bind(getTrainerSubscriptionController)));

//DASHBOARD MANAGEMENT ROUTES
adminRoutes.get("/dashboard",asyncHandler(adminDashboardController.handle.bind(adminDashboardController)));

//REVENUE MANAGEMENT ROUTES
adminRoutes.get("/revenue",asyncHandler(getPlatformEarningsController.handle.bind(getPlatformEarningsController)));

export default adminRoutes;
