require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const PORT = 5005;

const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/cohort-tools-api';
const Student = require('./models/Student.model');
const Cohort = require('./models/Cohorts.model');
// i did the research

console.log(process.env.MONGODB_ATLAS_URL);

mongoose
	.connect(process.env.MONGODB_ATLAS_URL)
	.then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
	.catch((err) => console.error('Error connecting to MongoDB', err));

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
			console.log('Retrieved books ->', el);
			res.json(el);
		})
		.catch((error) => {
			console.error('Error while retrieving books ->', error);
			res.status(500).send({ error: 'Failed to retrieve books' });
		});
});

//Cohorts routes
app.get('/api/cohorts', (req, res) => {
	res.json(cohorts);
});
app.post('/api/cohorts', (req, res) => {
	Cohort.create(req.body)
		.then((createCohort) => {
			res.status(201).send(createCohort);
		})
		.catch((error) => {
			res.status(500).send({ error: 'Failed to create a cohort' });
		});
});

app.get('/api/cohorts', (req, res) => {
	Cohort.find({})
		.then((cohorts) => {
			res.status(200).send(cohorts);
		})
		.catch((error) => {
			res.status(500).send({ error: 'Failed to retrieve cohorts' });
		});
});


app.get('/api/cohorts/:cohortsId', (req, res) => {
	const cohortId = req.params.id;
	Cohort.findById(cohortId)
		.then((cohort) => {
			res.status(200).json(cohort);
		})
		.catch((error) => {
			res.status(500).json({ error: 'Failed to retrieve cohort' });
		});
});

app.put('/api/students/:cohortsId', (req, res) => {
	const cohortsId = req.params.id;
	Cohort.findByIdAndUpdate(cohortsId, req.body, { new: true })
		.then((updateCohort) => {
			res.status(200).json(updateCohort);
		})
		.catch((error) => {
			res.status(500).json({ message: 'Error to update a new cohort' });
		});
});
app.delete('/recipes/:id', (req, res) => {
	const cohortId = req.params.id;
	Cohort.findByIdAndDelete(cohortId)
		.then((deleteCohort) => {
			res.status(204).send();
		})
		.catch((error) => {
			res.status(500).json({ message: 'Error to delete cohort' });
		});
});

//Students Routes
app.get('/api/students', (req, res) => {
	res.json(students);
});

app.post('/api/students', (req, res) => {
	Student.create(req.body)
		.then((createStudent) => {
			res.status(201).send(createStudent);
		})
		.catch((error) => {
			res.status(500).send({ error: 'Failed to create a student' });
		});
});

app.get('/api/students', (req, res) => {
	Student.find({})
		.then((students) => {
			res.status(200).send(students);
		})
		.catch((error) => {
			res.status(500).send({ error: 'Failed to retrieve students' });
		});
});

app.get('/api/students/cohort/:cohortId', (req, res) => {
	Student.find({ Cohort })
		.then((students) => {
			res.status(200).send(students);
		})
		.catch((error) => {
			res.status(500).send({ error: 'Failed to retrieve students' });
		});
});
app.get('/api/students/:studentId', (req, res) => {
	const studentId = req.params.id;
	Student.findById(studentId)
		.then((student) => {
			res.status(200).json(student);
		})
		.catch((error) => {
			res.status(500).json({ error: 'Failed to retrieve student' });
		});
});

app.put('/api/students/:studentId', (req, res) => {
	const studentId = req.params.id;
	Student.findByIdAndUpdate(studentId, req.body, { new: true })
		.then((updateStudent) => {
			res.status(200).json(updateStudent);
		})
		.catch((error) => {
			res.status(500).json({ message: 'Error to update a new student' });
		});
});
app.delete('/recipes/:id', (req, res) => {
	const recipeId = req.params.id;
	Student.findByIdAndDelete(recipeId)
		.then((deleteStudent) => {
			res.status(204).send();
		})
		.catch((error) => {
			res.status(500).json({ message: 'Error to delete student' });
		});
});

// START SERVER
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
