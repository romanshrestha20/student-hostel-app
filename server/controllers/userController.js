import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";

const VALID_ROLES = ["student", "owner", "admin"];
const VALID_GENDERS = ["male", "female", "unisex"];

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Failed to fetch users",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });
  next();
};

const isOwner = (req, res, next) => {
  if (req.user.role !== "owner")
    return res.status(403).json({ error: "Owner only" });
  next();
};

const loggedInUser = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  next();
};


// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUser = req.user;

    // Authorization: only admin or the user themselves can view
    if (isAdmin && loggedInUser.id !== userId) {
      return res.status(403).json({ error: "You are not authorized to view this user" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "Failed to fetch user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let { name, email, password, role, gender } = req.body;
    const loggedInUser = req.user;

    // Authorization: only admin can update other users, or user can update their own details
    if (loggedInUser.role !== "admin" && loggedInUser.id !== userId) {
      return res.status(403).json({ error: "You are not authorized to update this user" });
    }

    const data = {};

    if (name) data.name = name;

    // Normalize email to lowercase and check uniqueness
if (email) {
  email = email.toLowerCase();

  // Only run uniqueness check if email is different
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (currentUser && email !== currentUser.email) {
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing && existing.id !== userId) {
      return res.status(400).json({ error: "Email already in use" });
    }
  }

  data.email = email;
}

    if (password) {
      data.hashedPassword = await bcrypt.hash(password, 10);
    }

    // Role update only allowed by admins
    if (role !== undefined) {
      if (loggedInUser.role !== "admin") {
        return res.status(403).json({ error: "Only admins can update roles" });
      }
      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({ error: "Invalid role specified" });
      }
      data.role = role;
    }

    // Gender update only allowed by admins, only for students
    if (gender !== undefined) {
      if (loggedInUser.role !== "admin") {
        return res.status(403).json({ error: "Only admins can update gender" });
      }

      gender = gender.toLowerCase();
      if (!VALID_GENDERS.includes(gender)) {
        return res.status(400).json({ error: "Invalid gender value" });
      }

      const targetUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (targetUser.role === "student") {
        data.gender = gender;
      } else {
        data.gender = null; // Clear gender if not a student
      }
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: "Failed to update user",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUser = req.user;

    if (loggedInUser.role !== "admin") {
      return res.status(403).json({
        error: "You are not authorized to delete users",
      });
    }

    if (loggedInUser.id === userId) {
      return res.status(403).json({
        error: "You cannot delete your own account",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Failed to delete user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getUserUpdateLogs = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUser = req.user; // assume this is populated by auth middleware

    // Authorization check: only admin or the user themselves can access the logs
    if (loggedInUser.role !== "admin" && loggedInUser.id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to view these logs" });
    }

    const logs = await prisma.userUpdateLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });

    res.status(200).json({ logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      error: "Failed to search users",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};