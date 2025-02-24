import express from "express"
import { SubscriptionController } from "../../application/controllers/subscriptionController"
import { authenticate } from "../middlewares/authenticate"
const trainerRoutes = express.Router()

trainerRoutes.post("/add-subscription",authenticate,SubscriptionController.addSubscription)
trainerRoutes.get("/subscriptions",authenticate,SubscriptionController.getTrainerSubscriptions)



export default trainerRoutes