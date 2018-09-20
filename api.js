const express = require('express');
const apiRoutes = express.Router();
const jwt = require('jsonwebtoken');

const User = require('./app/models/user');

apiRoutes.post('/authenticate', (req, res) => {
	User.findOne({name: req.body.name}, 
			(err, user) => {
				if (err) throw err;
				
				if (!user) {
					res.json({
						success: true,
						message: 'authenticate fallido, usuario no encontrado'
					});
				}

				else if (user) {
					if (user.password != req.body.password) {
						res.json({
							success: false,
							message: 'autenticacion fallida, clave fallida'
						})
					} else {
						const token = jwt.sign({user}, req.app.get('superSecret'));

						res.json({
							success: true,
							message: 'Estas en tu token',
							token
						});
					}
				}
		})
});

apiRoutes.use((req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {
			if (err) {
				return res.json({
					success: false,
					message: 'autenticacion fallida'
				});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(404).send({
			success: false,
			message: 'no existe el token'
		});
	}
});

apiRoutes.get('/', (req, res) => {
	res.json({
		message: 'Bienvenido a  mi API'
	});
});

apiRoutes.get('/users', (req, res) => {
	User.find({}, (err, users) => {
		if (err) throw err;
		res.json({users});
	});
});

module.exports = apiRoutes;