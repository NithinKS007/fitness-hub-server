import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  adminDashboardController,
  trainerDashboardController,
  userDashboardController,
} from "@di/container-resolver";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const router = express.Router();
router.use(authenticate);  

router.get("/admins/dashboard",(authorizeRole(["admin"])),asyncHandler(adminDashboardController.handle.bind(adminDashboardController)));
router.get("/trainers/dashboard",authorizeRole(["trainer"]),asyncHandler(trainerDashboardController.handle.bind(trainerDashboardController)));
router.get("/users/dashBoard",authorizeRole(["user"]),asyncHandler(userDashboardController.handle.bind(userDashboardController)));