import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email with all required fields
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hashedPassword: true // Must match schema exactly
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify hashedPassword exists
    if (!user.hashedPassword) {
      return res.status(500).json({ error: "User record is missing password" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return response without password hash
    const { hashedPassword, ...userData } = user;
    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      error: "Login failed",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    // Validate role
    if (!['student', 'owner', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user - remove createdAt from select if not in schema
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // Only include createdAt if it exists in your schema
        ...(await prisma.user.fields.createdAt ? { createdAt: true } : {})
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ 
      error: "Failed to create user",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};