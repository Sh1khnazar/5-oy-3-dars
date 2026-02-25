const { Schema, model, Types } = require('mongoose')

const bookSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Kitob nomi kiritilishi shart'],
			trim: true,
			minlength: [2, 'Kitob nomi juda qisqa'],
			maxlength: [200, 'Kitob nomi juda uzun'],
		},
		pages: {
			type: Number,
			required: [true, 'Sahifalar soni kiritilishi shart'],
			min: [1, "Sahifalar soni kamida 1 ta bo'lishi kerak"],
		},
		year: {
			type: Number,
			required: [true, 'Nashr yili kiritilishi shart'],
			max: [new Date().getFullYear(), 'Kelajakdagi yilni kiritish mumkin emas'],
		},
		price: {
			type: Number,
			required: [true, 'Kitob narxi kiritilishi shart'],
			min: [0, "Narx manfiy bo'lishi mumkin emas"],
		},
		country: {
			type: String,
			required: [true, 'Davlat kiritilishi shart'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Kitob tavsifi kiritilishi shart'],
			minlength: [10, 'Tavsif juda qisqa'],
		},
		author: {
			type: Types.ObjectId,
			ref: 'Author',
			required: [true, 'Muallif ID-si kiritilishi shart'],
		},
	},
	{
		timestamps: true,
	},
)

module.exports = model('Book', bookSchema)
