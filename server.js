// Import dependencies
const express = require("express"); // Express Framework for routing and middleware
const flash = require("connect-flash"); // Displays one-time messages to the user, like success or error alerts
const dotenv = require("dotenv"); // Loads environment variables from a .env file
const path = require("path"); // Helps manage file paths in a cross-platform way
const session = require("express-session"); // Required for managing sessions, used by connect-flash
const db = require("./config/db"); // Database configuration to connect to MySQL

// Import route files
const patientRoutes = require("./routes/patientRoutes"); // Routes for patient actions (e.g., register, login)
const doctorRoutes = require("./routes/doctorRoutes"); // Routes for doctor actions
const adminRoutes = require("./routes/adminRoutes"); // Routes for admin actions
const appointmentRoutes = require("./routes/appointmentRoutes"); // Routes for appointment actions

// Import middleware
const { authenticateJWT } = require("./middleware/authMiddleware"); // JWT Authentication middleware

// Configure environment variables from .env file
dotenv.config();
console.log("Environment variables loaded");

// Create an Express app instance
const app = express();
console.log("Express app instance created");

// Set up EJS as the Template engine
app.set("view engine", "ejs"); // Tells Express to use EJS as the template engine
app.set("views", path.join(__dirname, "../frontend/views")); // Specify views directory for EJS templates
app.use(express.static(path.join(__dirname, "../frontend/public"))); // Serve static files (CSS, JS, Images) from the 'public' folder
console.log("EJS template engine and static files configured");

// Middleware to parse incoming JSON & URL-encoded payloads
app.use(express.json()); // Parses incoming request with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data sent in requests (like form submissions)
console.log("Middleware for parsing JSON and URL-encoded payloads set up");

// Set up session handling (required for flash messages)
app.use(
  session({
    secret: process.env.JWT_SECRET || "your_default_secret_key", // Secret key for signing the session ID cookie
    resave: false, // Forces the session to be saved back to the session store
    saveUninitialized: false, // Don't create a session until something is stored
  })
);
console.log("Session handling set up");

// Enable flash messages
app.use(flash()); // Used to send temporary success or error messages to the user
console.log("Flash messages enabled");

// Route handling middleware
console.log("doctorRoutes:", doctorRoutes);
app.use("/patients", patientRoutes); // Patient-related routes
app.use("/doctors", doctorRoutes); // Doctor-related routes
app.use("/admins", adminRoutes); // Admin-related routes
app.use("/appointments", authenticateJWT, appointmentRoutes); // Appointment-related routes (requires JWT)
console.log("Route handling middleware set up");

// Handle root route
app.get("/", (req, res) => {
  res.render("index"); // Render the 'index.ejs' file in the views directory
  console.log("Root route accessed");
});

// Error handling middleware for unhandled routes or internal errors
app.use((err, req, res, next) => {
  console.error("Error during request:", err.stack); // Log the error stack for debugging
  res.status(500).send("Something went wrong!"); // Send a generic error message to the client
});

// Start the server
const PORT = process.env.PORT || 3000; // Set the port from environment or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Confirmation that server started successfully
});
