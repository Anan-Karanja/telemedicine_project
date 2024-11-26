// Import the jsonwebtoken library for creating and verifying JWT tokens
const jwt = require("jsonwebtoken");

// Import dotenv to load environment variables from the .env file
require("dotenv").config();

// Secret key for signing JWTs, loaded from the .env file
const JWT_SESSION = process.env.JWT_SESSION;

// 1. Function to generate a JWT token for a user (patient, doctor, or admin)
const generateToken = (userId) => {
  /**
   * Generates a JWT token for the given user ID.
   * Payload: { id: userId } -> Embeds the user's ID in the token.
   * Options: { expiresIn: "1h" } -> Token will expire in 1 hour.
   */
  const token = jwt.sign({ id: userId }, JWT_SESSION, { expiresIn: "1h" });
  return token; // Return the generated token
};

// 2. Function to verify a JWT token from a request
const verifyToken = (token) => {
  /**
   * Verifies the provided JWT token.
   * If valid, it returns the decoded payload (e.g., user ID).
   * If invalid or expired, it throws an error.
   */
  try {
    const decoded = jwt.verify(token, JWT_SESSION);
    return decoded; // Return the decoded token data
  } catch (error) {
    // Throw an error if verification fails
    throw new Error("Invalid or expired token");
  }
};

// Export the functions for use in other parts of the app
module.exports = {
  generateToken,
  verifyToken,
};
