import express from "express"
import { TrainerController } from "../../application/controllers/trainerController"
const userRoutes = express.Router()
userRoutes.get("/trainers",TrainerController.getTrainers)
userRoutes.get("/trainers/:_id",TrainerController.getTrainerWithSubscription)
userRoutes.get("/trainer/suggestions",TrainerController.getTrainerSearchSuggestions)

export default userRoutes