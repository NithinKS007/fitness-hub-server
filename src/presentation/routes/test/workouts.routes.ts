import express from "express";
import { authenticate } from "@presentation/middlewares/auth.middleware";
import { asyncHandler } from "@shared/utils/async-handler";
import {
  addWorkoutController,
  deleteWorkoutController,
  getWorkoutController,
  updateWorkoutController,
} from "@di/container-resolver";
import { wrkoutSchema } from "@presentation/middlewares/validation-schemas/workout-schema";
import { validate } from "@presentation/middlewares/validation.middleware";
import { authorizeRole } from "@presentation/middlewares/autherisation.middleware";

const router = express.Router();
router.use(authenticate);
router.use(authorizeRole(["user"]));

router.post("/workouts",wrkoutSchema,validate,asyncHandler(addWorkoutController.handle.bind(addWorkoutController)))
      .get("/workouts",asyncHandler(getWorkoutController.handle.bind(getWorkoutController)))
      .delete("/workouts/:id",asyncHandler(deleteWorkoutController.handle.bind(deleteWorkoutController)))
      .patch("/workouts/:id",asyncHandler(updateWorkoutController.handle.bind(updateWorkoutController)));

export default router;
