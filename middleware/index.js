const Comment = require('../models/comment');
const Campground = require('../models/campground');
var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'Please Login');
	res.redirect('/login');
};

middlewareObj.checkCampgroundOwnerShip = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCamp) {
			if (err || !foundCamp) {
				req.flash('error', 'Campground not found!!!');
				res.redirect('back');
			} else {
				if (foundCamp.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'Permission denied');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'Please Login');
		res.redirect('back');
	}
};

middlewareObj.checkCommentOwnerShip = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err || !foundComment) {
				req.flash('error', 'Comment not found!!!');
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'Permission denied');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'Please Login');
		res.redirect('back');
	}
};

module.exports = middlewareObj;
