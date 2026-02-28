const CustomErrorHandler = require('../utils/custom-error.handler')

module.exports = (err, req, res, next) => {
	console.error(err)

	// Agar xato CustomErrorHandler orqali yaratilgan bo‘lsa
	if (err instanceof CustomErrorHandler) {
		const statusCode = err.statusCode || 400
		return res.status(statusCode).json({
			success: false,
			status: statusCode,
			message: err.message,
			errors: err.errors || [],
		})
	}

	// MongoDB duplicate key xatosi uchun qo‘shimcha tekshiruv
	if (err.code === 11000) {
		const key = Object.keys(err.keyValue)[0]
		return res.status(400).json({
			success: false,
			status: 400,
			message: `${key} allaqachon mavjud`,
			errors: [],
		})
	}

	// Boshqa xatolar uchun fallback
	return res.status(500).json({
		success: false,
		status: 500,
		message: 'Serverda kutilmagan xatolik yuz berdi!',
	})
}
