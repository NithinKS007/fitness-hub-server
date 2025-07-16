import { body } from "express-validator/lib";

export const wrkoutSchema = [
  body("date")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date string")
    .notEmpty()
    .withMessage("Date is required"),

  body("workouts")
    .isObject()
    .withMessage("Workouts must be an object")
    .notEmpty()
    .withMessage("Workouts are required"),

  body("workouts.*")
    .isObject()
    .withMessage("Each body part should be an object with exercises")
    .notEmpty()
    .withMessage("Each body part should contain exercises"),

  body("workouts.*.exercises")
    .isArray()
    .withMessage("Exercises should be an array")
    .notEmpty()
    .withMessage("Exercises are required"),

  body("workouts.*.exercises.*.name")
    .isString()
    .withMessage("Exercise name must be a string")
    .notEmpty()
    .withMessage("Exercise name is required"),

  body("workouts.*.exercises.*.sets")
    .isArray()
    .withMessage("Sets should be an array")
    .notEmpty()
    .withMessage("At least one set is required"),

  body("workouts.*.exercises.*.sets.*.kg")
    .isFloat({ min: 1 })
    .withMessage("Kg must be a positive number")
    .notEmpty()
    .withMessage("Kg is required"),

  body("workouts.*.exercises.*.sets.*.reps")
    .isInt({ min: 1 })
    .withMessage("Reps must be at least 1")
    .notEmpty()
    .withMessage("Reps is required"),

  body("workouts.*.exercises.*.sets.*.time")
    .isFloat({ min: 1 })
    .withMessage("Time must be a positive number")
    .notEmpty()
    .withMessage("Time is required"),
];
