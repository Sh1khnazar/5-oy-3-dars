const { Schema, model } = require('mongoose')

const bookSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		pages: {
			type: Number,
			required: true,
		},
		year: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
)

module.exports = model('Book', bookSchema)
