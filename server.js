const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('./config');
const User = require('./app/models/user');

const apiRoutes = require('./api');

//settings
const port = process.env.PORT || 3000;

//connectc database
mongoose.connect(config.database, {useNewUrlParser: true});

mongoose.Promise = global.Promise;
app.set('SuperSecret', config.secret);

//routes
app.get('/', (req, res) => {
	res.send('La api esta en localhost:3000/api');
});

app.get('/setup', (req, res) => {
	const testUser = new User({
		name: 'paul',
		password: 'clave',
		admin: true
	});
	testUser.save((err) => {
		if (err) throw err;
		console.log("Usuario creado satisfactoriamente!");
		res.json({
			success: true
		});
	});
});

//API
app.use('/api', apiRoutes);


//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.listen(port, () => {
	console.log('server on port 3000');
})