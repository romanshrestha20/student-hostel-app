import { verifyToken } from "../utils/jwt.js";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No token provided"));
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    return next(new Error("JWT secret not configured"));
  }

  try {
    const decoded = verifyToken(token);

    req.user = {
      ...decoded,
      isAdmin: decoded.role === "admin"
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token has expired"));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid token"));
    }
    next(err); // Generic error fallback
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        throw new ForbiddenError("Insufficient permissions");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
