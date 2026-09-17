import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  getUserMyTrainersController,
  updateProfileController,
  getUserDetailsController,
  getUsersController,
  updateUserBlockStatusController,
  verifyTrainerController,
} from "@di/container-resolver";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const router = express.Router();
router.use(authenticate)

router.get("/users",asyncHandler(getUsersController.handle.bind(getUsersController))); // pass the view as query here like users | trainers  and status all| approved | approvedfalse,true | isblockedfalse
router.get("/users/:id",asyncHandler(getUserDetailsController.handle.bind(getUserDetailsController))); // pass the view as query here like users | trainers to view details 
router.put("/users",authorizeRole(["trainer","user"]),asyncHandler(updateProfileController.handle.bind(updateProfileController)));// update according to the role
router.patch("/users/:id",authorizeRole(["admin"]),asyncHandler(updateUserBlockStatusController.handle.bind(updateUserBlockStatusController)));
router.get("/users/trainers",authorizeRole(["user"]),asyncHandler(getUserMyTrainersController.handle.bind(getUserMyTrainersController)));
router.patch("/trainers/:id/approval",asyncHandler(verifyTrainerController.handle.bind(verifyTrainerController)));

export default router