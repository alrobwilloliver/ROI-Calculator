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
	propertyImg: {
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

modules.exports = mongoose.model('property', propertySchema);