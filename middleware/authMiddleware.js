// Import required modules
const jwt = require("jsonwebtoken"); // Used for creating and verifying JSON Web Tokens

// 1. Middleware to check if the user is authenticated (has a valid JWT Token)
const authenticateJWT = (req, res, next) => {
  // Extract the token from the "Authorization" header in the form "Bearer <token>"
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is provided, respond with an error
  if (!token) {
    return res.status(403).json({ message: "Access denied, no token provided" });
  }

  // Verify the token using the secret key from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Respond with an error if the token is invalid or expired
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // If the token is valid, attach the user information to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};

// 2. Middleware to check if the authenticated user is a doctor or admin
const isDoctorOrAdmin = (req, res, next) => {
  // Ensure the user is authenticated before checking their role
  if (!req.user) {
    return res.status(403).json({ message: "Access denied" });
  }

  // Check if the user's role is "doctor" or "admin"
  if (req.user.role === "doctor" || req.user.role === "admin") {
    // If the user is authorized, proceed to the next middleware or route handler
    return next();
  }

  // If the user does not have the correct role, respond with an error
  return res
    .status(403)
    .json({ message: "Access denied, insufficient permissions" });
};

// 3. Middleware to check if the authenticated user is a patient
const isPatient = (req, res, next) => {
  // Ensure the user is authenticated before checking their role
  if (!req.user) {
    return res.status(403).json({ message: "Access denied" });
  }

  // Check if the user's role is "patient"
  if (req.user.role === "patient") {
    // If the user is authorized, proceed to the next middleware or route handler
    return next();
  }

  // If the user does not have the correct role, respond with an error
  return res
    .status(403)
    .json({ message: "Access denied, insufficient permissions" });
};

// Export the middleware functions for use in routes
module.exports = { authenticateJWT, isDoctorOrAdmin, isPatient };
