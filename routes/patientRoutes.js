// patientRoutes.js
const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

// Route for patient registration
router.post("/register", patientController.registerPatient);

// Route for patient login
router.post("/login", patientController.loginPatient);

// Route to view a patient's profile
router.get("/:id", patientController.getPatientById);

// Route to update a patient's profile
router.put("/:id", patientController.updatePatient);

// Route to delete a patient account
router.delete("/:id", patientController.deletePatient);

module.exports = router;
