const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Campground = require('../models/campground');
const middleware = require('../middleware');

//Comment Routes
// New comment form
router.get('/camp-grounds/:id/comments/new', middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err || !campground) {
			req.flash('error', 'Something went wrong!!!');
			console.error(err);
			res.redirect('back');
		} else {
			res.render('comments/new-comment', { campground: campground });
		}
	});
});

// Add comment
router.post('/camp-grounds/:id/comments', middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err || !campground) {
			req.flash('error', 'Something went wrong!!!');
			console.error(err);
			res.redirect('back');
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err || !comment) {
					req.flash('error', 'Something went wrong!!!');
					console.error(err);
					res.redirect('back');
				} else {
					//Add User details to Comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();

					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Comment successfully posted');
					res.redirect('/camp-grounds/' + campground._id);
				}
			});
		}
	});
});

//Edit Comment
router.get('/camp-grounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnerShip, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err || !foundCampground) {
			req.flash('error', 'Campground not found!!!');
			return res.redirect('back');
		}
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err || !foundComment) {
				req.flash('error', 'Comment could not be found!!!');
				res.redirect('back');
			} else {
				res.render('comments/edit-comment', { campground_id: req.params.id, comment: foundComment });
			}
		});
	});
});

//Update Comment
router.put('/camp-grounds/:id/comments/:comment_id', middleware.checkCommentOwnerShip, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err || !updatedComment) {
			req.flash('error', 'Comment could not be updated!!!');
			res.redirect('back');
		} else {
			req.flash('success', 'Comment updated successfully');
			res.redirect('/camp-grounds/' + req.params.id);
		}
	});
});

//Destroy Comment
router.delete('/camp-grounds/:id/comments/:comment_id', middleware.checkCommentOwnerShip, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			req.flash('error', 'Comment could not be deleted!!!');
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted successfully');
			res.redirect('/camp-grounds/' + req.params.id);
		}
	});
});

module.exports = router;
