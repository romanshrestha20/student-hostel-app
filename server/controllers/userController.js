import prisma from "../prisma/client.js";
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
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ 
      error: "Failed to fetch users",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id; // No parseInt needed for UUID

    const loggedInUser = req.user;
    
    // Authorization check
    if (loggedInUser.role !== "admin" && loggedInUser.id !== userId) {
      return res.status(403).json({ 
        error: "You are not authorized to access this user" 
      });
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
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ 
      error: "Failed to fetch user",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // UUID string
    const { name, email, password, role } = req.body;

    // Authorization check
    const loggedInUser = req.user;
    if (loggedInUser.role !== "admin" && loggedInUser.id !== userId) {
      return res.status(403).json({ 
        error: "You are not authorized to update this user" 
      });
    }

    // Build update data
    const data = { name, email };
    
    // Only admins can change roles
    if (loggedInUser.role === "admin" && role) {
      data.role = role;
    }

    // Handle password update
    if (password) {
      data.hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    res.status(200).json({ 
      message: "User updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ 
      error: "Failed to update user",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // UUID string

    // Authorization - only admins can delete users
    const loggedInUser = req.user;
    if (loggedInUser.role !== "admin") {
      return res.status(403).json({ 
        error: "You are not authorized to delete users" 
      });
    }

    // Prevent self-deletion
    if (loggedInUser.id === userId) {
      return res.status(403).json({ 
        error: "You cannot delete your own account" 
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ 
      message: "User deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      error: "Failed to delete user",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};