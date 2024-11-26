const db = require('../config/db');

const findByEmail = async (email) => {
  console.log("findByEmail called with email:", email);
  const [results] = await db.execute('SELECT * FROM doctors WHERE email = ?', [email]);
  return results[0];
};

const create = async (doctor) => {
  console.log("create called with doctor:", doctor);
  const [result] = await db.execute('INSERT INTO doctors (firstName, lastName, email, password, specialty, phone, experience) VALUES (?, ?, ?, ?, ?, ?, ?)', 
  [doctor.firstName, doctor.lastName, doctor.email, doctor.password, doctor.specialty, doctor.phone, doctor.experience]);
  return result.insertId;
};

const update = async (id, updatedDoctor) => {
  console.log("update called with id:", id, "and updatedDoctor:", updatedDoctor);
  const [result] = await db.execute('UPDATE doctors SET firstName = ?, lastName = ?, specialty = ?, phone = ?, experience = ? WHERE id = ?', 
  [updatedDoctor.firstName, updatedDoctor.lastName, updatedDoctor.specialty, updatedDoctor.phone, updatedDoctor.experience, id]);
  return result.affectedRows;
};

const deleteDoctor = async (id) => {
  console.log("deleteDoctor called with id:", id);
  const [result] = await db.execute('DELETE FROM doctors WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  findByEmail,
  create,
  update,
  delete: deleteDoctor,
};
