const { Schema, model } = require('mongoose')

const quoteSchema = new Schema(
	{
		content: { type: String, required: true, trim: true },
		book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
		addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Kimlar layk bosganini saqlash uchun
	},
	{ timestamps: true },
)

module.exports = model('Quote', quoteSchema)
