const Joi = require('joi')

const bookValidationSchema = Joi.object({
	title: Joi.string().trim().min(2).max(200).required().messages({
		'string.empty': 'Kitob nomi kiritilishi shart',
		'string.min': 'Kitob nomi juda qisqa',
		'string.max': 'Kitob nomi juda uzun',
	}),

	pages: Joi.number().integer().min(1).required().messages({
		'number.min': "Sahifalar soni kamida 1 ta bo'lishi kerak",
	}),

	year: Joi.number()
		.integer()
		.max(new Date().getFullYear())
		.required()
		.messages({
			'number.max': 'Kelajakdagi yilni kiritish mumkin emas',
		}),

	price: Joi.number().min(0).required().messages({
		'number.min': "Narx manfiy bo'lishi mumkin emas",
	}),

	country: Joi.string().trim().required().messages({
		'string.empty': 'Davlat kiritilishi shart',
	}),

	description: Joi.string().min(10).required().messages({
		'string.min': 'Tavsif juda qisqa',
	}),

	author: Joi.string().hex().length(24).required().messages({
		'string.empty': 'Muallif ID-si kiritilishi shart',
		'string.length': 'Muallif ID-si noto‘g‘ri formatda',
		'string.hex': 'Muallif ID-si noto‘g‘ri formatda',
	}),
})

module.exports = bookValidationSchema
