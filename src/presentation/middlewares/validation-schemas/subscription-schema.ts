import { body } from "express-validator/lib";

export const subscriptionSchema = [
  body("subPeriod")
    .custom((value) =>
      ["monthly", "yearly", "quarterly", "halfYearly"].includes(value)
    )
    .withMessage("Invalid subscription period,Please give a valid period")
    .notEmpty()
    .withMessage("Subscription period is required")
    .isString()
    .withMessage("Subscription period must be a string"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number and cannot be negative")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than zero")
    .notEmpty()
    .withMessage("Price is required"),

  body("sessionsPerWeek")
    .isInt({ min: 1 })
    .withMessage("Sessions per week cannot be less than 1")
    .notEmpty()
    .withMessage("Sessions per week is required"),

  body("durationInWeeks")
    .isInt({ min: 1 })
    .withMessage("Duration in weeks must be at least 1")
    .notEmpty()
    .withMessage("Duration in weeks is required"),

  body("totalSessions")
    .isInt({ min: 1 })
    .withMessage("Total sessions must be at least 1")
    .notEmpty()
    .withMessage("Total sessions is required"),
];
