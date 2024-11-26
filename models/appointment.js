// Import the database connection
const db = require("../config/db");

// Define the Appointment model with methods for appointment-related actions
const appointment = {
  // 1. Create a new appointment
  // Takes appointmentData, which includes patient ID, doctor ID, date, time, and reason for the appointment.
  create: async (appointmentData) => {
    const { patientId, doctorId, date, time, reason } = appointmentData;

    // SQL query to insert a new appointment into the database
    const sql = `INSERT INTO Appointments (patient_id, doctor_id, date, time, reason) VALUES (?, ?, ?, ?, ?)`;

    // Execute the query with the provided data
    const [result] = await db.execute(sql, [
      patientId,
      doctorId,
      date,
      time,
      reason,
    ]);

    // Return the ID of the newly created appointment
    return result.insertId;
  },

  // 2. Retrieve an appointment by ID
  findById: async (id) => {
    // SQL query to select all details of an appointment where the ID matches
    const sql = `SELECT * FROM Appointments WHERE id = ?`;

    // Execute the query
    const [rows] = await db.execute(sql, [id]);

    // Return the first result (or undefined if not found)
    return rows[0];
  },

  // 3. Retrieve appointments for a specific patient
  findByPatientId: async (patientId) => {
    // SQL query to select all appointments for a specific patient
    const sql = `SELECT * FROM Appointments WHERE patient_id = ? ORDER BY date, time`;

    // Execute the query
    const [rows] = await db.execute(sql, [patientId]);

    // Return the list of appointments
    return rows;
  },

  // 4. Retrieve appointments for a specific doctor
  findByDoctorId: async (doctorId) => {
    // SQL query to select all appointments for a specific doctor
    const sql = `SELECT * FROM Appointments WHERE doctor_id = ? ORDER BY date, time`;

    // Execute the query
    const [rows] = await db.execute(sql, [doctorId]);

    // Return the list of appointments
    return rows;
  },

  // 5. Update an appointment
  update: async (id, updateData) => {
    const { date, time, reason } = updateData;

    // SQL query to update the appointment details
    const sql = `UPDATE Appointments SET date = ?, time = ?, reason = ? WHERE id = ?`;

    // Execute the query
    const [result] = await db.execute(sql, [date, time, reason, id]);

    // Return the number of rows affected
    return result.affectedRows;
  },

  // 6. Delete an appointment by ID
  delete: async (id) => {
    // SQL query to delete an appointment where the ID matches
    const sql = `DELETE FROM Appointments WHERE id = ?`;

    // Execute the query
    const [result] = await db.execute(sql, [id]);

    // Return the number of rows affected
    return result.affectedRows;
  },
};

// Export the Appointment model for use in the controller
module.exports = appointment;
