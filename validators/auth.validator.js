const Joi = require('joi')

const registerSchema = Joi.object({
	username: Joi.string().min(3).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
})

const verifySchema = Joi.object({
	email: Joi.string().email().required(),
	code: Joi.string().length(6).required(),
})

const refreshSchema = Joi.object({
	token: Joi.string().required(),
})

module.exports = {
	registerSchema,
	loginSchema,
	verifySchema,
	refreshSchema,
}
