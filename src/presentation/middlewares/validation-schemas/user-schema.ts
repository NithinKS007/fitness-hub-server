import { body } from "express-validator/lib";

export const userSchema = [
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
      `*Password must contain at least 8 characters, one uppercase letter, 
       one lowercase letter, one number, and one special character`
    )
    .notEmpty()
    .withMessage("*Password is required"),
];

export const signinSchema = [
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
      `*Password must contain at least 8 characters, one uppercase letter, 
       one lowercase letter, one number, and one special character`
    )
    .notEmpty()
    .withMessage("*Password is required"),
];
