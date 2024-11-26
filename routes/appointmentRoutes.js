// Import necessary modules
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware to verify authentication

// 1. Create a new appointment
router.post(
  "/",
  authMiddleware.verifyPatientToken, // Ensures the requester is a logged-in patient
  appointmentController.createAppointment
);
// ✅ Route: POST /appointments
// Description: Allows a patient to create a new appointment.
// Middleware: Authenticates the patient using their token.

// 2. Get an appointment by ID
router.get(
  "/:id",
  authMiddleware.verifyToken, // Ensures any authenticated user can access
  appointmentController.getAppointmentById
);
// ✅ Route: GET /appointments/:id
// Description: Retrieves details of a specific appointment by ID.
// Middleware: Verifies that the requester is authenticated.

// 3. Get all appointments for the logged-in patient
router.get(
  "/patient",
  authMiddleware.verifyPatientToken, // Ensures the requester is a logged-in patient
  appointmentController.getAppointmentsForPatient
);
// ✅ Route: GET /appointments/patient
// Description: Fetches all appointments for the logged-in patient.
// Middleware: Authenticates the patient using their token.

// 4. Get all appointments for the logged-in doctor
router.get(
  "/doctor",
  authMiddleware.verifyDoctorToken, // Ensures the requester is a logged-in doctor
  appointmentController.getAppointmentsForDoctor
);
// ✅ Route: GET /appointments/doctor
// Description: Fetches all appointments for the logged-in doctor.
// Middleware: Authenticates the doctor using their token.

// 5. Update an appointment
router.put(
  "/:id",
  authMiddleware.verifyPatientToken, // Ensures only the patient can update their appointment
  appointmentController.updateAppointment
);
// ✅ Route: PUT /appointments/:id
// Description: Allows a patient to update an existing appointment by ID.
// Middleware: Authenticates the patient using their token.

// 6. Delete an appointment
router.delete(
  "/:id",
  authMiddleware.verifyToken, // Ensures only authorized users can delete
  appointmentController.deleteAppointment
);
// ✅ Route: DELETE /appointments/:id
// Description: Deletes an appointment by ID. This could be performed by a patient or admin.
// Middleware: Authenticates the user using their token.

// Export the router to use in the main server file
module.exports = router;
