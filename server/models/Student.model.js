const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const studentSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  linkedinUrl: String,
  languages: ["English", "Spanish", "French", "German", "Portuguese", "Dutch", "Other"],
  program: String,
  background: String,
  image: String,
  cohort: String,
  projects: [],
});
const student = mongoose.model("student", studentSchema);
module.exports = student;