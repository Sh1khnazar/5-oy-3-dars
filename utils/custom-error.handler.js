module.exports = class CustomErrorHandler extends Error {
	constructor(status, message, errors = []) {
		super(message)
		this.status = status
		this.errors = errors
	}
	static UnAuthorized(message = 'Avtorizatsiyadan oʻtilmagan', errors = []) {
		return new CustomErrorHandler(401, message, errors)
	}

	static BadRequest(message, errors = []) {
		return new CustomErrorHandler(400, message, errors)
	}

	static NotFound(message = 'Ma’lumot topilmadi', errors = []) {
		return new CustomErrorHandler(404, message, errors)
	}

	static Forbidden(message = 'Sizga ruxsat berilmagan', errors = []) {
		return new CustomErrorHandler(403, message, errors)
	}
}
