const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const studentSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	phone: String,
	linkedinUrl: String,
	languages: [
		'English',
		'Spanish',
		'French',
		'German',
		'Portuguese',
		'Dutch',
		'Other',
	],
	program: String,
	background: String,
	image: String,
	cohort: String,
	projects: [],
	cohort: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Cohort',
	},
});
const student = mongoose.model('Student', studentSchema);
module.exports = student;
