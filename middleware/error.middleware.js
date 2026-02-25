const CustomErrorHandler = require('../utils/custom-error.handler')

module.exports = (err, req, res, next) => {
	if (err instanceof CustomErrorHandler) {
		return res.status(err.status).json({
			status: err.status,
			message: err.message,
			errors: err.errors,
		})
	}

	return res.status(500).json({
		status: 500,
		message: 'Serverda kutilmagan xatolik yuz berdi!',
		error: err.message,
	})
}
