const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', function(req, res) {
	res.render('home');
});

//Auth Routes
//Register Form
router.get('/register', function(req, res) {
	res.render('register');
});

//Register
router.post('/register', function(req, res) {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			req.flash('error', err.message);
			return res.render('register');
		} else {
			passport.authenticate('local')(req, res, function() {
				req.flash('success', 'Welcome to Camp World');
				res.redirect('/camp-grounds');
			});
		}
	});
});

//Login Form
router.get('/login', function(req, res) {
	res.render('login');
});

//Login
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/camp-grounds',
		failureRedirect: '/login'
	}),
	function(req, res) {}
);

//Logout
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'You have successfully logged out');
	res.redirect('/camp-grounds');
});

router.get('*', function(req, res) {
	res.send('error');
});

module.exports = router;
