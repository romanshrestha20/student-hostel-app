import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserUpdateLogs,
  searchUsers,
} from "../controllers/userController.js";

import { validateUpdateUser } from "../middlewares/validiateUser.js";
import { handleValidationErrors } from "../middlewares/handleValidatationErrors.js";
import { authorizeRole, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all users
router.get("/", protect, authorizeRole("admin"), getAllUsers);

// Get user by ID
router.get("/:id", protect, getUserById);

// Update user by ID
router.put(
  "/:id",
  protect,

  validateUpdateUser,
  handleValidationErrors,
  updateUser
);

router.get("/:id/logs", protect, authorizeRole("admin"), getUserUpdateLogs);

// Delete user by ID
router.delete("/:id", protect, authorizeRole("admin"), deleteUser);

// Search users by name or email
router.get(
  "/search",
  protect,
  authorizeRole("admin"),
  searchUsers
);

export default router;
