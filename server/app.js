require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const PORT = 5005;

const mongoose = require('mongoose');
// const MONGO_URL = 'mongodb://localhost:27017/cohort-tools-api';
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
// const cohorts = require('./cohorts.json');
// const students = require('./students.json');
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
			next(error);
		});
});

//Cohorts routes

app.post('/api/cohorts', (req, res, next) => {
	Cohort.create(req.body)
		.then((createCohort) => {
			res.status(201).send(createCohort);
		})
		.catch((error) => {
			next(error);
		});
});

app.get('/api/cohorts', (req, res, next) => {
	Cohort.find({})
		.then((allCohorts) => {
			res.status(200).send(allCohorts);
		})
		.catch((error) => {
			next(error);
		});
});

app.get('/api/cohorts/:cohortId', (req, res, next) => {
	const cohortId = req.params.cohortId;
	Cohort.findById(cohortId)
		.then((cohort) => {
			res.status(200).json(cohort);
		})
		.catch((error) => {
			res.send(error);
			//next(error);
		});
});

app.put('/api/cohorts/:cohortId', (req, res, next) => {
	const cohortsId = req.params.cohortId;
	Cohort.findByIdAndUpdate(cohortsId, req.body, { new: true })
		.then((updateCohort) => {
			res.status(200).json(updateCohort);
		})
		.catch((error) => {
			next(error);
		});
});
app.delete('/api/cohorts/:cohortId', (req, res, next) => {
	const cohortId = req.params.cohortId;
	Cohort.findByIdAndDelete(cohortId)
		.then((deleteCohort) => {
			res.status(204).send();
		})
		.catch((error) => {
			next(error);
		});
});

//Students Routes
app.get('/api/students', (req, res, next) => {
	Student.find({})
		.then((allStudents) => {
			res.status(200).send(allStudents);
		})
		.catch((error) => {
			next(error);
		});
});

app.post('/api/students', (req, res, next) => {
	Student.create(req.body)
		.then((createStudent) => {
			res.status(201).send(createStudent);
		})
		.catch((error) => {
			next(error);
		});
});

app.get('/api/students', (req, res, next) => {
	Student.find({})
		.populate('cohort')
		.then((students) => {
			res.status(200).send(students);
		})
		.catch((error) => {
			next(error);
		});
});

app.get('/api/students/cohort/:cohortId', (req, res, next) => {
	Student.find({ cohort: req.params.cohortId })
		.populate('cohort')
		.then((students) => {
			res.status(200).send(students);
		})
		.catch((error) => {
			next(error);
		});
});

app.get('/api/students/:studentId', (req, res, next) => {
	const studentId = req.params.studentId;
	Student.findById(studentId)
		.populate('cohort')
		.then((student) => {
			res.status(200).json(student);
		})
		.catch((error) => {
			next(error);
		});
});

app.put('/api/students/:studentId', (req, res, next) => {
	const studentId = req.params.studentId;
	Student.findByIdAndUpdate(studentId, req.body, { new: true })
		.then((updateStudent) => {
			res.status(200).json(updateStudent);
		})
		.catch((error) => {
			next(error);
		});
});
app.delete('/api/students/:studentId', (req, res, next) => {
	const studentId = req.params.studentId;
	Student.findByIdAndDelete(studentId)
		.then((deleteStudent) => {
			res.status(204).send();
		})
		.catch((error) => {
			next(error);
		});
});

const {
	errorHandler,
	notFoundHandler,
} = require('./middleware/error-handling');

// Set up custom error handling middleware:
app.use(errorHandler);
app.use(notFoundHandler);

// START SERVER
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
