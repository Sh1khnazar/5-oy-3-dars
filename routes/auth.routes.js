const express = require('express')
const authMiddleware = require('../middleware/authorization')
const authRouter = express.Router()
const {
	register,
	verify,
	login,
	refreshToken,
	logout,
	getMe,
	updateMe,
} = require('../controllers/auth.controller')

const validate = require('../middleware/validate.middleware')
const {
	registerSchema,
	loginSchema,
	verifySchema,
	refreshSchema,
	updateMeSchema,
} = require('../validators/auth.validator')

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/verify', validate(verifySchema), verify)
authRouter.post('/login', validate(loginSchema), login)
authRouter.post('/refresh', validate(refreshSchema), refreshToken)
authRouter.post('/logout', logout)

authRouter.get('/me', authMiddleware, getMe)
authRouter.patch(
	'/update-me',
	authMiddleware,
	validate(updateMeSchema),
	updateMe,
)

module.exports = authRouter
