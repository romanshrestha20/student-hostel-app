import { body } from "express-validator";

export const validateCreateUser = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["student", "owner", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
];


export const validateUpdateUser = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["student", "owner", "admin"])
    .withMessage("Role must be either 'student', 'owner', or 'admin'"),
];
