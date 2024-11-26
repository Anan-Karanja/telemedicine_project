const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

// Admin registration route
router.post("/register", adminController.registerAdmin);

// Admin login route
router.post("/login", adminController.loginAdmin);

// Add a new doctor
router.post("/doctor", adminController.addDoctor);

// Remove a doctor by ID
router.delete("/doctor/:doctorId", adminController.removeDoctor);

// View all doctors
router.get("/doctors", adminController.viewDoctors);

// View analytics
router.get("/analytics", adminController.viewAnalytics);

// view all patients
router.get("/patients", adminController.viewPatients);

// Remove a patient by ID
router.delete("/patient/:patientId", adminController.removePatient);

module.exports = router;
