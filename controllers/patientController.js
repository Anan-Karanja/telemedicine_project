const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");

// Register a new patient
const registerPatient = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingPatient = await Patient.findOne({ where: { email } });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = await Patient.create({
      name,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "Patient registered", patient: newPatient });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login a patient
const loginPatient = async (req, res) => {
  const { email, password } = req.body;
  try {
    const patient = await Patient.findOne({ where: { email } });
    if (!patient) {
      return res.status(400).json({ message: "Patient not found" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: patient.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// View a patient's profile
const getPatientById = async (req, res) => {
  const patientId = req.params.id;
  try {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a patient's profile
const updatePatient = async (req, res) => {
  const patientId = req.params.id;
  const { name, email, password } = req.body;
  try {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (password) {
      patient.password = await bcrypt.hash(password, 10);
    }
    patient.name = name || patient.name;
    patient.email = email || patient.email;
    await patient.save();
    res.status(200).json({ message: "Patient updated", patient });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a patient's account
const deletePatient = async (req, res) => {
  const patientId = req.params.id;
  try {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    await patient.destroy();
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerPatient,
  loginPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
