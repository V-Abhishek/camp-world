const mongoose = require('mongoose');
// Schema
const campGroundSchema = new mongoose.Schema({
	'site-name': String,
	image: String,
	description: String,
	price: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

//Compile Schema into a model and export
module.exports = mongoose.model('Campground', campGroundSchema);
