// Import the database connection, so we can execute SQL queries on the MySQL database.
const db = require("../config/db");

// Import bcrypt for hashing password
const bcrypt = require("bcryptjs");

// Here, we create an object called Patient. It will hold all the functions we need for patient actions.
const patient = {
  // 1. Create a new patient record in the database
  create: async (patientData) => {
    // Destructure patientData to get individual patient fields like name, email, and password.
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dob,
      gender,
      address,
    } = patientData;

    // Hash the password before storing it, adding a "salt" (random data) to make it more secure.
    const saltRounds = 10; // We use 10 rounds, which is secure but efficient.
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // SQL command: Insert the new patient's info (including hashed password) into the database.
    const sql = `INSERT INTO Patients(first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

    // Run the SQL command with the patient's details and get the ID of the new patient.
    const [result] = await db.execute(sql, [
      firstName,
      lastName,
      email,
      passwordHash,
      phone,
      dob,
      gender,
      address,
    ]);

    // Return the ID of the newly created patient record
    return result.insertId;
  },

  // 2. Retrieve a patient record from the database by patient ID
  findById: async (id) => {
    // SQL query to select all fields from Patients table where id matches the provided ID
    const sql = `SELECT * FROM Patients WHERE id = ?`;

    // Run the SQL command with the ID and get the patient's data.
    const [rows] = await db.execute(sql, [id]);

    // Return the first row (patient record) from the result, or undefined if no record was found
    return rows[0];
  },

  // 3. Finding a Patient by Their Email (useful for login)
  findByEmail: async (email) => {
    // SQL command: Search for a patient by their email address.
    const sql = `SELECT * FROM Patients WHERE email = ?`;

    // Run the SQL command with the email and get the patient's data if it exists.
    const [rows] = await db.execute(sql, [email]);

    // Return the first row (patient record) from the result, or undefined if no record was found
    return rows[0];
  },

  // 4. Updating a Patient's Details
  update: async (id, updateData) => {
    // Extract fields from updateData to get values for updating.
    const { firstName, lastName, phone, dob, gender, address } = updateData;

    // SQL command: Update specific fields in the Patients table where the ID matches.
    const sql = `UPDATE Patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?`;

    // Run the SQL command with the updated values and patient ID.
    const [result] = await db.execute(sql, [
      firstName,
      lastName,
      phone,
      dob,
      gender,
      address,
      id,
    ]);

    // Return 1 if the update worked or 0 if no record was updated.
    return result.affectedRows;
  },

  // Delete a patient record from the database by patient ID
  delete: async (id) => {
    // SQL command: Remove a record from the Patients table with a matching ID.
    const sql = `DELETE FROM Patients WHERE id = ?`;

    // Run the SQL command with the patient ID.
    const [result] = await db.execute(sql, [id]);

    // Return 1 if deletion was successful or 0 if not.
    return result.affectedRows;
  },
};

// Finally, export the Patient object so other files can use these methods.
module.exports = patient;
