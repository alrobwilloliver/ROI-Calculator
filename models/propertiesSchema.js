const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
	propertyTitle: {
		type: String,
		required: true
	},
	propertyAddress: {
		type: String,
		required: true
	},
	propertyPrice: {
		type: String,
		required: true
	},
	propertyUrl: {
		type: String,
		required: true
	},
	propertyImage: {
		type: String,
		required: true
	},
	propertyDesc: {
		type: String,
		required: true
	},
	timeStamp: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

module.exports = mongoose.model('Property', propertySchema);