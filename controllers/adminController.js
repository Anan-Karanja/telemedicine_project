const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Database connection
const doctor = require("../models/doctor");

const adminController = {
  // 1. Controller function to register a new admin
  registerAdmin: async (req, res) => {
    // Extract the admin details from the request body
    const { name, email, password } = req.body;
    try {
      // 1. Check if the admin email is already registered
      const checkSql = "SELECT * FROM Admins WHERE email = ?";
      const [existingAdmin] = await db.execute(checkSql, [email]);

      // If an existing admin is found, respond with a 409 status (conflict)
      if (existingAdmin.length > 0) {
        return res.status(409).json({ message: "Email is already in use" });
      }

      // 2. Hash the password before saving to the database for security
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // 3. Insert new admin's details into the Admins table
      const sql =
        "INSERT INTO Admins (name, email, password_hash) VALUES (?, ?, ?)";
      const [result] = await db.execute(sql, [name, email, passwordHash]); // Execute SQL query

      // Send a successful response with the ID of the newly created admin
      res.status(201).json({
        message: "Admin registered successfully",
        adminId: result.insertId,
      });
    } catch (error) {
      // If any errors occur during registration, send a 500 status (Internal Server Error)
      res.status(500).json({ message: "Error registering admin" });
    }
  },

  // 2. Admin login and token generation
  loginAdmin: async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    try {
      // 1. Find the admin with the provided email in the database
      const sql = "SELECT * FROM Admins WHERE email = ?";
      const [rows] = await db.execute(sql, [email]);

      // If no admin is found with the provided email, respond with a 404 status (Not found)
      if (rows.length === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Get the first (and only) matching admin record
      const admin = rows[0];

      // 2. Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, admin.password_hash);

      // If the password do not match, respond with a 401 status (Unauthorized)
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // 3. Generate a JWT token for the authenticated admin
      const token = jwt.sign(
        { id: admin.id, role: "admin" }, // Payload containing the admin's ID and role
        process.env.JWT_SECRET, // Secret key for signing the token
        { expiresIn: "1h" } // Token expiration time
      );

      // Send a successful response with the generate token
      res.json({ message: "Login Successful", token });
    } catch (error) {
      // If any errors occur during login, send a 500 status (Internal Server Error)
      res.status(500).json({ message: "Error Logging in", error });
    }
  },

  // 3. Add a new doctor
  addDoctor: async (req, res) => {
    const { name, email, specialty, phone } = req.body;

    try {
      // Check if doctor email already exists
      const checkSql = "SELECT * FROM Doctors WHERE email = ?";
      const [existingDoctor] = await db.execute(checkSql, [email]);

      if (existingDoctor.length > 0) {
        // 409 Conflict
        return res
          .status(409)
          .json({ message: "Email is already in use for another doctor" });
      }

      // Insert new doctor into the Doctors table
      const sql =
        "INSERT INTO Doctors (name, email, specialty, phone) VALUES (?, ?, ?, ?)";
      const [result] = await db.execute(sql, [name, email, specialty, phone]);

      // 201 Created - Return success message with new doctor's ID
      res.status(201).json({
        message: "Doctor added successfully",
        doctorId: result.insertId,
      });
    } catch (error) {
      // Handle any errors that occur during doctor addition
      res.status(500).json({ message: "Error adding doctor", error });
    }
  },

  // 4. Remove a doctor
  removeDoctor: async (req, res) => {
    const { doctorId } = req.params;

    try {
      // Remove doctor from the Doctors table by ID
      const sql = "DELETE FROM Doctors WHERE id = ?";
      const [result] = await db.execute(sql, [doctorId]);

      if (result.affectedRows === 0) {
        // 404 Not Found - Return error if no doctor is found with the given ID
        return res.status(404).json({ message: "Doctor not found" });
      }

      // 200 OK - Doctor was successfully removed
      res.json({ message: "Doctor removed successfully" });
    } catch (error) {
      // 500 Internal Server Error - An unexpected error occurred on the server
      res.status(500).json({ message: "Error removing doctor", error });
    }
  },

  // 5. View all doctors
  viewDoctors: async (req, res) => {
    try {
      // Retrieve all doctors from the Doctors table
      const sql = "SELECT * FROM Doctors";
      const [rows] = await db.execute(sql);

      // 200 OK - Return the list of doctors
      res.json(rows);
    } catch (error) {
      // 500 Internal Server Error - An unexpected error occurred on the server
      res.status(500).json({ message: "Error retrieving doctors", error });
    }
  },

  // 6. View platform analytics
  viewAnalytics: async (req, res) => {
    try {
      // Query to get counts of doctor, patients, and appointments
      const sql = `SELECT 
      (SELECT COUNT(*) FROM Doctors) AS totalDoctors,
      (SELECT COUNT(*) FROM Patients) AS totalPatients,
      (SELECT COUNT(*) FROM Appointments) AS totalAppointment,
      `;

      const [rows] = await db.execute(sql); // Execute query
      // 200 OK - Return the analytics data
      res.json(rows[0]);
    } catch (error) {
      // 500 Internal Server Error - An unexpected error occurred on the server
      res.status(500).json({ message: "Error retrieving analytics", error });
    }
  },

  // 7. View all patients
  viewPatients: async (req, res) => {
    try {
      // Retrieve all patient from the Patients table
      const sql = "SELECT * FROM Patients";
      const [rows] = await db.execute(sql);
      // 500 Internal Server Error - An unexpected error occurred on the server
      res.status(500).json({ message: "Error retrieving patients", error });
    } catch (error) {}
  },

  // 8. Remove a patient
  removePatient: async (req, res) => {
    const { patientId } = req.params; // Get patient ID from URL parameters

    try {
      // Remove patient from the Patients table by ID
      const sql = "DELETE FROM Patients WHERE id = ?";
      const [result] = await db.execute(sql, [patientId]);

      if (result.affectedRows === 0) {
        // 404 Not Found - No patient was found with the given
        return res.status(404).json({ message: "Patient not found" });
      }

      // 200 OK - Patient was successfully removed
      res.json({ message: "Patient removed successfully" });
    } catch (error) {
      // 500 Internal Server Error - An unexpected error occurred on the server
      res.status(500).json({ message: "Error removing patient", error });
    }
  },
};

// Export the adminController so it can be used in other parts of the application
module.exports = adminController;
