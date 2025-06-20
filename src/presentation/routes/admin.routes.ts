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
} from "di/container-resolver";

const adminRoutes = express.Router();

//USER MANAGEMENT ROUTES
adminRoutes.get(
  "/users",
  authenticate,
  asyncHandler(getUsersController.handle.bind(getUsersController))
);
adminRoutes.get(
  "/users/:userId",
  authenticate,
  asyncHandler(getUserDetailsController.handle.bind(getUserDetailsController))
);
adminRoutes.patch(
  "/users/:userId",
  authenticate,
  asyncHandler(
    updateUserBlockStatusController.handle.bind(updateUserBlockStatusController)
  )
);

//TRAINER MANAGEMENT ROUTES
adminRoutes.get(
  "/trainers",
  authenticate,
  asyncHandler(getAllTrainersController.handle.bind(getAllTrainersController))
);
adminRoutes.get(
  "/trainers/:trainerId",
  authenticate,
  asyncHandler(
    getTrainerDetailsController.handle.bind(getTrainerDetailsController)
  )
);
adminRoutes.get(
  "/trainers/approval",
  authenticate,
  asyncHandler(
    getVerifyTrainerController.handle.bind(getVerifyTrainerController)
  )
);
adminRoutes.patch(
  "/trainers/:trainerId/approval",
  authenticate,
  asyncHandler(verifyTrainerController.handle.bind(verifyTrainerController))
);
adminRoutes.get(
  "/trainers/:trainerId/subscriptions",
  authenticate,
  asyncHandler(
    getTrainerSubscriptionController.handle.bind(
      getTrainerSubscriptionController
    )
  )
);

//DASHBOARD MANAGEMENT ROUTES
adminRoutes.get(
  "/dashboard",
  authenticate,
  asyncHandler(adminDashboardController.handle.bind(adminDashboardController))
);

//REVENUE MANAGEMENT ROUTES
adminRoutes.get(
  "/revenue",
  authenticate,
  asyncHandler(
    getPlatformEarningsController.handle.bind(getPlatformEarningsController)
  )
);

export default adminRoutes;
