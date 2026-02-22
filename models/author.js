const { Schema, model } = require('mongoose')

const authorSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		dateOfBirth: {
			type: Number,
			required: true,
		},
		dateOfDeath: {
			type: Number,
			default: null,
		},
		country: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			default: 'default-author.png',
		},
	},
	{
		timestamps: true,
	},
)

module.exports = model('Author', authorSchema)
