require("dotenv").config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const PORT = 5005;

const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/cohort-tools-api'
const Student = require("./models/Student.model");
 // i did the research 

console.log(process.env.MONGODB_ATLAS_URL);

mongoose
	.connect(process.env.MONGODB_ATLAS_URL)
	.then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
	.catch(err => console.error("Error connecting to MongoDB", err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const cohorts = require('./cohorts.json');
const students = require('./students.json');
// ...


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
const cors = require('cors');
// ...
app.use(
	cors({
		origin: ['http://localhost:5173'],
	})
);
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get('/docs', (req, res) => {
	// res.sendFile(__dirname + '/views/docs.html');
	Student.find({})
		.then((el) => {
			console.log("Retrieved books ->", el);
			res.json(el);
		})
		.catch((error) => {
			console.error("Error while retrieving books ->", error);
			res.status(500).send({ error: "Failed to retrieve books" });
		});
});

app.get('/api/cohorts', (req, res) => {
	res.json(cohorts);
});
app.get('/api/students', (req, res) => {
	res.json(students);
});

// START SERVER
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
