import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  getApprovedTrainersController,
  getTrainerWithSubController,
} from "@di/container-resolver";

const publicRoutes = express.Router();

publicRoutes.get("/trainers",asyncHandler(getApprovedTrainersController.handle.bind(getApprovedTrainersController)));
publicRoutes.get("/trainers/:trainerId",asyncHandler(getTrainerWithSubController.handle.bind(getTrainerWithSubController)));

export default publicRoutes