const doctorModel = require("../models/doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleError = (res, error, message = "Server Error", statusCode = 500) => {
  res.status(statusCode).json({ message, error: error.message });
};

// 1. Register a new doctor
const registerDoctor = async (req, res) => {
  console.log("registerDoctor called");
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      specialty,
      phone,
      experience,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !specialty || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingDoctor = await doctorModel.findByEmail(email);
    if (existingDoctor) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const doctorId = await doctorModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      specialty,
      phone,
      experience,
    });

    res.status(201).json({ message: "Doctor registered successfully", doctorId });
  } catch (error) {
    handleError(res, error, "Error registering doctor");
  }
};

// 2. Login a doctor
const loginDoctor = async (req, res) => {
  console.log("loginDoctor called");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const doctor = await doctorModel.findByEmail(email);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: doctor.id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    handleError(res, error, "Error logging in doctor");
  }
};

// 3. Update doctor profile
const updateDoctorProfile = async (req, res) => {
  console.log("updateDoctorProfile called");
  try {
    const doctorId = req.user.id;
    const { firstName, lastName, specialty, phone, experience } = req.body;

    const updateResult = await doctorModel.update(doctorId, {
      firstName,
      lastName,
      specialty,
      phone,
      experience,
    });

    if (updateResult === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    handleError(res, error, "Error updating profile");
  }
};

// 4. Delete doctor profile
const deleteDoctorProfile = async (req, res) => {
  console.log("deleteDoctorProfile called");
  try {
    const doctorId = req.user.id;

    const deleteResult = await doctorModel.delete(doctorId);

    if (deleteResult === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor profile deleted successfully" });
  } catch (error) {
    handleError(res, error, "Error deleting profile");
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  updateDoctorProfile,
  deleteDoctorProfile,
};
