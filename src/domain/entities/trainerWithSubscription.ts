import { Subscription } from "./subscriptionEntity";
import { Trainer } from "./trainerEntity";

export interface TrainerWithSubscription extends Trainer {
    subscriptionDetails:Subscription[]
}
