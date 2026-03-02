const CustomErrorHandler = require('../utils/custom-error.handler')
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
	try {
		const authHeader = req.headers.authorization

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw CustomErrorHandler.Unauthorized('Bearer token is not defined')
		}

		const token = authHeader.split(' ')[1]

		const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

		req.user = decode // Foydalanuvchi ma'lumotlarini req obyektiga qo'shamiz
		next()
	} catch (error) {
		next(CustomErrorHandler.Unauthorized("Yaroqsiz yoki muddati o'tgan token"))
	}
}
