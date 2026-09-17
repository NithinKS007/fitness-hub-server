import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  blockSubPlanController,
  createSubPlanController,
  deleteSubPlanController,
  editSubPlanController,
  getTrainerSubscribersController,
  getTrainerSubscriptionController,
  cancelSubscriptionController,
  checkSubscriptionStatusController,
  getUserSubscriptionController,
  purchaseSubscriptionController,
  verifySubscriptionController,
  webhookController,
} from "@di/container-resolver";
import { subscriptionSchema } from "@presentation/middlewares/validation-schemas/subscription-schema";
import express from "express";
import { validate } from "@presentation/middlewares/validation.middleware";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const router = express.Router();
router.use(authenticate)

//TRAINER SUBSCRIPTION ROUTES
router.post("/trainers/subscriptions",subscriptionSchema,validate,authorizeRole(["trainer"]),asyncHandler(createSubPlanController.handle.bind(createSubPlanController)));
router.get("/trainers/subscriptions",authorizeRole(["trainer"]),asyncHandler(getTrainerSubscriptionController.handle.bind(getTrainerSubscriptionController)));
router.patch("/trainers/subscriptions/:id",authorizeRole(["trainer"]),asyncHandler(blockSubPlanController.handle.bind(blockSubPlanController)));
router.put("/trainers/subscriptions/:id",subscriptionSchema,validate,authorizeRole(["trainer"]),asyncHandler(editSubPlanController.handle.bind(editSubPlanController)));
router.delete("/trainers/subscriptions/:id",authorizeRole(["trainer"]),asyncHandler(deleteSubPlanController.handle.bind(deleteSubPlanController)));
router.get("/trainers/subscribers",authorizeRole(["trainer"]),asyncHandler(getTrainerSubscribersController.handle.bind(getTrainerSubscribersController)));

//USER SUBSCRIPTION ROUTES
router.post("/users/subscriptions/checkout",authorizeRole(["user"]),asyncHandler(purchaseSubscriptionController.handle.bind(purchaseSubscriptionController)));
router.get("/users/subscriptions",authorizeRole(["user"]),asyncHandler(getUserSubscriptionController.handle.bind(getUserSubscriptionController)));
router.get("/users/subscriptions/:id/verify",authorizeRole(["user"]),asyncHandler(verifySubscriptionController.handle.bind(verifySubscriptionController)));
router.patch("/users/subscriptions/cancel",authorizeRole(["user"]),asyncHandler(cancelSubscriptionController.handle.bind(cancelSubscriptionController)));
router.get("/users/subscriptions/trainers/:id/status/",authorizeRole(["user"]),asyncHandler(checkSubscriptionStatusController.handle.bind(checkSubscriptionStatusController)));

export default router