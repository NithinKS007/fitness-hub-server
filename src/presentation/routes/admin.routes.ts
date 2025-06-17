import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import {
  adminDashboardController,
  getUsersController,
  updateUserBlockStatusController,
  getallTrainersController,
  getTrainerDetailsController,
  getVerifyTrainerController,
  verifyTrainerController,
  getPlatformEarningsController,
  getTrainerSubscriptionController,
  getUserDetailsController,
} from "../../di/di";
import { asyncHandler } from "@shared/utils/async-handler";

const adminRoutes = express.Router();

//USER MANAGEMENT ROUTES
adminRoutes.get(
  "/users",
  authenticate,
  asyncHandler(getUsersController.handleGetUsers.bind(getUsersController))
);
adminRoutes.get(
  "/users/:userId",
  authenticate,
  asyncHandler(
    getUserDetailsController.handleGetUserDetails.bind(getUserDetailsController)
  )
);
adminRoutes.patch(
  "/users/:userId",
  authenticate,
  asyncHandler(
    updateUserBlockStatusController.updateBlockStatus.bind(
      updateUserBlockStatusController
    )
  )
);

//TRAINER MANAGEMENT ROUTES
adminRoutes.get(
  "/trainers",
  authenticate,
  asyncHandler(
    getallTrainersController.handleGetTrainers.bind(getallTrainersController)
  )
);
adminRoutes.get(
  "/trainers/:trainerId",
  authenticate,
  asyncHandler(
    getTrainerDetailsController.handleGetTrainerDetails.bind(
      getTrainerDetailsController
    )
  )
);
adminRoutes.get(
  "/trainers/approval",
  authenticate,
  asyncHandler(
    getVerifyTrainerController.handleGetVerifyPendingList.bind(
      getVerifyTrainerController
    )
  )
);
adminRoutes.patch(
  "/trainers/:trainerId/approval",
  authenticate,
  asyncHandler(
    verifyTrainerController.handleVerification.bind(verifyTrainerController)
  )
);
adminRoutes.get(
  "/trainers/:trainerId/subscriptions",
  authenticate,
  asyncHandler(
    getTrainerSubscriptionController.handleGetTrainerSubscriptions.bind(
      getTrainerSubscriptionController
    )
  )
);

//DASHBOARD MANAGEMENT ROUTES
adminRoutes.get(
  "/dashboard",
  authenticate,
  asyncHandler(
    adminDashboardController.getAdminDashBoardData.bind(
      adminDashboardController
    )
  )
);

//REVENUE MANAGEMENT ROUTES
adminRoutes.get(
  "/revenue",
  authenticate,
  asyncHandler(
    getPlatformEarningsController.handleGetEarnings.bind(
      getPlatformEarningsController
    )
  )
);

export default adminRoutes;
