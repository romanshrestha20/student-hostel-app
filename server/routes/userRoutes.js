import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserUpdateLogs,
  searchUsers,
  uploadUserAvatar,      // import the avatar upload controller
} from "../controllers/userController.js";

import { validateUpdateUser } from "../middlewares/validiateUser.js";
import { handleValidationErrors } from "../middlewares/handleValidatationErrors.js";
import { authorizeRole, protect } from "../middlewares/authMiddleware.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

// Upload user avatar
router.post(
  "/:id/avatar/:model",
  protect,
  upload.single("avatar"),   // multer middleware for single file upload with field name "avatar"
  uploadUserAvatar
);

// Get all users
router.get("/", protect, authorizeRole("admin"), getAllUsers);

// Search users by name or email
router.get("/search", protect, authorizeRole("admin"), searchUsers);

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

// Get user update logs
router.get("/:id/logs", protect, authorizeRole("admin"), getUserUpdateLogs);

// Delete user by ID
router.delete("/:id", protect, authorizeRole("admin"), deleteUser);

export default router;
