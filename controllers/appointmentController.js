// Import the Appointment model for database operations
const appointmentModel = require("../models/appointment");

// 1. Create a new appointment
const createAppointment = async (req, res) => {
  // ✅createAppointment:
  // Handles the creation of a new appointment. Takes the patient ID from the token (req.user.id) and the rest of the details from req.body.
  try {
    const patientId = req.user.id; // Assume the logged-in user is a patient
    const { doctorId, date, time, reason } = req.body;

    // Validate input
    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create the new appointment
    const appointmentId = await appointmentModel.create({
      patientId,
      doctorId,
      date,
      time,
      reason,
    });

    // Send a success response
    res
      .status(201)
      .json({ message: "Appointment created successfully", appointmentId });
  } catch (error) {
    res.status(500).json({
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

// 2. Get an appointment by ID
const getAppointmentById = async (req, res) => {
  // ✅getAppointmentById:
  // Retrieves a specific appointment by its ID. Can be used by patients or doctors.
  try {
    const { id } = req.params; // Extract the appointment ID from the URL params

    // Find the appointment
    const appointment = await appointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Send the appointment details
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointment",
      error: error.message,
    });
  }
};

// 3. Get all appointments for a specific patient
const getAppointmentsForPatient = async (req, res) => {
  // ✅getAppointmentsForPatient:
  // Retrieves all appointments for the logged-in patient (req.user.id).
  try {
    const patientId = req.user.id;

    // Fetch appointments
    const appointments = await appointmentModel.findByPatientId(patientId);

    // Send the list of appointments
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointments",
      error: error.message,
    });
  }
};

// 4. Get all appointments for a specific doctor
const getAppointmentsForDoctor = async (req, res) => {
  // ✅getAppointmentsForDoctor:
  // Retrieves all appointments for the logged-in doctor (req.user.id).
  try {
    const doctorId = req.user.id;

    // Fetch appointments
    const appointments = await appointmentModel.findByDoctorId(doctorId);

    // Send the list of appointments
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving appointments",
      error: error.message,
    });
  }
};

// 5. Update an appointment
const updateAppointment = async (req, res) => {
  // ✅updateAppointment:
  // Allows a patient or admin to update appointment details. Takes the appointment ID from req.params.id and new details from req.body.
  try {
    const { id } = req.params; // Appointment ID
    const { date, time, reason } = req.body;

    // Validate input
    if (!date || !time || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update the appointment
    const updateResult = await appointmentModel.update(id, { date, time, reason });

    // Check if the appointment was updated
    if (updateResult === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Send success response
    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

// 6. Delete an appointment
const deleteAppointment = async (req, res) => {
  // ✅deleteAppointment:
  // Deletes an appointment by ID. Assumes authorization checks are handled elsewhere.
  try {
    const { id } = req.params; // Appointment ID

    // Delete the appointment
    const deleteResult = await appointmentModel.delete(id);

    // Check if the appointment was deleted
    if (deleteResult === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Send success response
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting appointment",
      error: error.message,
    });
  }
};

// Export all functions for use in routes
module.exports = {
  createAppointment,
  getAppointmentById,
  getAppointmentsForPatient,
  getAppointmentsForDoctor,
  updateAppointment,
  deleteAppointment,
};
