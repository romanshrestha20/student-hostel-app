import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

// Helper for validating allowed roles
const VALID_ROLES = ["student", "owner", "admin"];

// helper function to validate gender
const VALID_GENDERS = ["male", "female", "unisex"];

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hashedPassword: true,
      },
    });

    if (!user || !user.hashedPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { hashedPassword, ...userData } = user;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, role = "student", gender } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    // Require gender only for users with role = student
    if (role === "student") {
      if (!gender) {
        return res
          .status(400)
          .json({ error: "Gender is required for students" });
      }

      if (!VALID_GENDERS.includes(gender.toLowerCase())) {
        return res.status(400).json({ error: "Invalid gender value" });
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role,
        gender: role === "student" ? gender : null, // Only require gender for students
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true, // Make sure createdAt exists in your schema
      },
    });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Failed to create user",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true, // Ensure this exists in your schema
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching logged-in user:", error);
    res.status(500).json({
      error: "Failed to fetch user",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
