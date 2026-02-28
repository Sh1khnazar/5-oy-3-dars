const express = require('express')
const authRouter = express.Router()
const {
	register,
	verify,
	login,
	refreshToken,
} = require('../controllers/auth.controller')

const validate = require('../middleware/validate.middleware')
const {
	registerSchema,
	loginSchema,
	verifySchema,
	refreshSchema,
} = require('../validators/auth.validator')

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/verify', validate(verifySchema), verify)
authRouter.post('/login', validate(loginSchema), login)
authRouter.post('/refresh', validate(refreshSchema), refreshToken)

module.exports = authRouter
