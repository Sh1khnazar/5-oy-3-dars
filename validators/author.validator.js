const Joi = require('joi')

const authorValidationSchema = Joi.object({
	firstName: Joi.string().trim().min(2).max(50).required().messages({
		'string.empty': 'Ism kiritilishi shart',
		'string.min': 'Ism kamida 2 ta harfdan iborat boʻlishi kerak',
	}),

	lastName: Joi.string().trim().min(2).required().messages({
		'string.empty': 'Familiya kiritilishi shart',
	}),

	dateOfBirth: Joi.number()
		.integer()
		.min(1000)
		.max(new Date().getFullYear())
		.required()
		.messages({
			'number.max': "Tug'ilgan yil kelajakda bo'lishi mumkin emas",
		}),

	dateOfDeath: Joi.number()
		.integer()
		.min(Joi.ref('dateOfBirth'))
		.allow(null)
		.messages({
			'number.min': "O'lim yili tug'ilgan yildan oldin bo'lishi mumkin emas!",
		}),

	country: Joi.string().trim().required(),

	bio: Joi.string().min(10).required(),

	image: Joi.string().default('default-author.png'),
})

module.exports = authorValidationSchema
