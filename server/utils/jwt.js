import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export const generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
