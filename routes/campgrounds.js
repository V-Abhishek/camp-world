const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

//INDEX - Display all campsites
router.get('/camp-grounds', function(req, res) {
	Campground.find({}, function(err, campGrounds) {
		if (err || !campGrounds) {
			req.flash('error', 'Something went wrong!!!');
			console.error(err);
			res.redirect('back');
		} else {
			res.render('campgrounds/view-camps', { data: campGrounds });
		}
	});
});

//NEW - Display form to add new campsites
router.get('/camp-grounds/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new-camp-form');
});

//CREATE - Add campsite to database
router.post('/camp-grounds', middleware.isLoggedIn, function(req, res) {
	let site = req.body.siteName;
	let imageURL = req.body.img;
	let campDescription = req.body.description;
	let price = req.body.price;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newSite = { 'site-name': site, image: imageURL, description: campDescription, price: price, author: author };
	Campground.create(newSite, function(err, camp) {
		if (err || !camp) {
			req.flash('error', 'Campground could not be added!!!');
			console.error(err);
			res.redirect('back');
		} else {
			req.flash('success', 'Campground successfully added');
			res.redirect('/camp-grounds');
		}
	});
});

//SHOW -Display details of a campsite
router.get('/camp-grounds/:id', function(req, res) {
	let id = req.params.id;
	Campground.findById(id).populate('comments').exec(function(err, campsite) {
		if (err || !campsite) {
			req.flash('error', 'Campground not found!!!');
			console.err(err);
			res.redirect('back');
		} else {
			res.render('campgrounds/campsite-details', { data: campsite });
		}
	});
});

//EDIT - Display edit form
router.get('/camp-grounds/:id/edit', middleware.checkCampgroundOwnerShip, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCamp) {
		res.render('campgrounds/edit-camp-form', { campground: foundCamp });
	});
});

//UPDATE - Update camp details
router.put('/camp-grounds/:id', middleware.checkCampgroundOwnerShip, function(req, res) {
	let site = req.body.siteName;
	let imageURL = req.body.img;
	let campDescription = req.body.description;
	let price = req.body.price;
	let updateSite = { 'site-name': site, image: imageURL, description: campDescription, price: price };
	Campground.findByIdAndUpdate(req.params.id, updateSite, function(err, updatedCampGround) {
		if (err || !updatedCampGround) {
			req.flash('error', 'Campground details could not be updated');
			res.redirect('/camp-grounds');
		} else {
			req.flash('success', 'Campground details updated successfully');
			res.redirect('/camp-grounds/' + req.params.id);
		}
	});
});

//DESTROY
router.delete('/camp-grounds/:id', middleware.checkCampgroundOwnerShip, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			req.flash('error', 'Campground could not be deleted!!!');
			console.error(err);
			res.redirect('/camp-grounds');
		} else {
			req.flash('success', 'Campground deleted successfully');
			res.redirect('/camp-grounds');
		}
	});
});

module.exports = router;

/*
Campground.create(
	{
		'site-name': 'Yosemite National Park',
		image: 'https://cdn.pixabay.com/photo/2016/08/26/17/33/landscape-1622739_1280.jpg',
		description: 'This is a stunning site. '
	},
	function(err, campground) {
		if (err) {
			console.error(err);
		} else {
			console.log(campground);
		}
	}
);

let campGrounds = [
	{
		'site-name': 'Acadia National Park',
		image: 'https://cdn.pixabay.com/photo/2013/02/10/22/21/acadia-national-park-80357_1280.jpg'
	},
	{
		'site-name': 'Yosemite National Park',
		image: 'https://cdn.pixabay.com/photo/2016/11/06/00/33/landscape-1801985_1280.jpg'
	},
	{
		'site-name': 'Denali National Park',
		image: 'https://cdn.pixabay.com/photo/2016/08/26/17/33/landscape-1622739_1280.jpg'
	}
];
*/
