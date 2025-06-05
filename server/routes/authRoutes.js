import express from "express";
import { createUser, loginUser } from "../controllers/authController.js";
import { validateCreateUser } from "../middlewares/validiateUser.js";
import { handleValidationErrors } from "../middlewares/handleValidatationErrors.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);

// Register a new user
router.post(
  "/register",
  validateCreateUser,
  handleValidationErrors,
  createUser
);

export default router;
