import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { validateUpdateUser } from "../middlewares/validiateUser.js";
import { handleValidationErrors } from "../middlewares/handleValidatationErrors.js";
import { authorizeRole, authorizeUpdateUser, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all users
router.get("/", protect, authorizeRole("admin"), getAllUsers);

// Get user by ID
router.get("/:id", protect,  getUserById);

// Update user by ID
router.put(
  "/:id",
  protect,
  authorizeUpdateUser,
  validateUpdateUser,
  handleValidationErrors,
  updateUser
);

// Delete user by ID
router.delete("/:id", protect, authorizeRole("admin"), deleteUser);

export default router;
