import { Subscription } from "./subscription";
import { Trainer } from "./trainer";

export interface TrainerWithSubscription extends Trainer {
  subscriptionDetails: Subscription[];
}
