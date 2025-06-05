import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the header

  try {
    // Verify the token using the secret key
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: "Server error: JWT secret not configured",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    next();
  };
};

// middlewares/authorizeUpdateUser.js
export const authorizeUpdateUser = (req, res, next) => {
  const loggedInUser = req.user; // set by protect middleware
  const userIdToUpdate = parseInt(req.params.id);

  if (loggedInUser.role === "admin" || loggedInUser.id === userIdToUpdate) {
    // Allowed if the user is an admin or updating their own profile
    return next();
  } else {
    return res.status(403).json({ error: "You are not authorized to update this user" });
  }
};
