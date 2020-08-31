const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');
//const seedDB = require('./seed');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

let url = process.env.DATABASEURL || 'mongodb://localhost/camp_world_db';
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(url);

const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');

const User = require('./models/user');

//Passport Configuaration
app.use(
	require('express-session')({
		secret: 'This is for security',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware to add current user to all templates
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

//seedDB(); //Seed Database

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server Started successfully');
});
