import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      message: "Users fetched successfully",
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const loggedInUser = req.user; // set by protect middleware
    // Check if the logged-in user is an admin or trying to access their own profile
    if (loggedInUser.role !== "admin" && loggedInUser.id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to access this user" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user: user,
    });
  } catch (error) {}
  console.error("Error fetching user:", error);
  res.status(500).json({ error: "Failed to fetch user" });
};

// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const { name, email, password, role } = req.body;
    // Build the data object to update
    const data = { name, email, role };

    if (password) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    // Check if the logged-in user is an admin
    const loggedInUser = req.user; // set by protect middleware
    if (loggedInUser.role !== "admin" || loggedInUser.id === userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete users" });
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // Delete the user
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
