import { body } from "express-validator/lib";

export const slotSchema = [
  body("time")
    .matches(/^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/)
    .withMessage("Time must be in 12-hour format (e.g., 01:30 AM)"),

  body("date")
    .isISO8601()
    .withMessage(
      "Date must be a valid ISO 8601 date format (e.g., 2025-06-28T00:00:00.000Z)"
    )
    .notEmpty()
    .withMessage("Date is required"),
];
