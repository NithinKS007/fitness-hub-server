import { body } from "express-validator/lib";

export const trainerSchema  = [
  body("fname")
    .isString()
    .withMessage("*First name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("*First name can only contain letters and spaces")
    .notEmpty()
    .withMessage("*First name is required"),

  body("lname")
    .isString()
    .withMessage("*Last name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("*Last name can only contain letters and spaces")
    .notEmpty()
    .withMessage("*Last name is required"),

  body("email")
    .isEmail()
    .withMessage("*Email is invalid")
    .normalizeEmail()
    .notEmpty()
    .withMessage("*Email is required"),

  body("password")
    .isString()
    .withMessage("*Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      `*Password must contain at least 8 characters, 
       one uppercase letter, one lowercase letter, one number, and one special character`
    )
    .notEmpty()
    .withMessage("*Password is required"),

  body("dateOfBirth")
    .isDate()
    .withMessage("Date of Birth must be a valid date")
    .notEmpty()
    .withMessage("Date of Birth is required"),

  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must be a 10-digit number")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("yearsOfExperience")
    .isInt({ min: 1 })
    .withMessage("Years of Experience must be a positive integer")
    .notEmpty()
    .withMessage("Years of Experience is required"),
];
