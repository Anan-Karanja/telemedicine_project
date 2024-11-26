const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const authenticateJWT = require("../middleware/authMiddleware");

console.log("doctorController:", doctorController);

// 1. Register a new doctor
router.post("/register", doctorController.registerDoctor);
// ➡️POST /doctors/register:
// This route allows the registration of a new doctor by calling the registerDoctor function in the doctorController. No authentication is required for registration.

// 2. Login a doctor and get JWT token
router.post("/login", doctorController.loginDoctor);
// ➡️POST /doctors/login:
// This route allows doctors to log in by providing their credentials. It calls the loginDoctor function, which checks credentials and returns a JWT token.

// 3. Update doctor profile
router.put("/profile", authenticateJWT, doctorController.updateDoctorProfile);
// ➡️PUT /doctors/profile:
// This route updates the doctor’s profile information. It uses authenticateJWT middleware to ensure that the request is made by a logged-in doctor. The updateDoctorProfile function handles the update logic.

// 4. Delete doctor profile
router.delete("/profile", authenticateJWT, doctorController.deleteDoctorProfile);
// ➡️DELETE /doctors/profile:
// This route allows the doctor to delete their own profile. Like the update route, it uses authenticateJWT to ensure that only the logged-in doctor can delete their profile. The deleteDoctorProfile function performs the deletion.

// Export the router to be used in the server
module.exports = router;
