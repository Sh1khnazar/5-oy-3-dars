const Quote = require('../models/quote')
const CustomErrorHandler = require('../utils/custom-error.handler')

// 1. Iqtibos qo'shish
exports.addQuote = async (req, res, next) => {
	try {
		const { content, bookId } = req.body
		const newQuote = await Quote.create({
			content,
			book: bookId,
			addedBy: req.user.id,
		})
		res.status(201).json({ success: true, data: newQuote })
	} catch (error) {
		next(error)
	}
}

// 2. Kitob ID si bo'yicha iqtiboslarni olish (Rasmdagi sahifa uchun)
exports.getQuotesByBook = async (req, res, next) => {
	try {
		const quotes = await Quote.find({ book: req.params.bookId })
			.populate('addedBy', 'username')
			.sort('-createdAt')
		res.status(200).json({ success: true, count: quotes.length, data: quotes })
	} catch (error) {
		next(error)
	}
}

// 3. Iqtibosni tahrirlash (Faqat egasi uchun)
exports.updateQuote = async (req, res, next) => {
	try {
		const quote = await Quote.findById(req.params.id)
		if (!quote) throw CustomErrorHandler.NotFound('Iqtibos topilmadi')

		if (quote.addedBy.toString() !== req.user.id) {
			throw CustomErrorHandler.Forbidden(
				"Faqat o'z iqtibosingizni o'zgartira olasiz",
			)
		}

		quote.content = req.body.content || quote.content
		await quote.save()
		res.status(200).json({ success: true, data: quote })
	} catch (error) {
		next(error)
	}
}

// 4. Iqtibosni o'chirish (Faqat egasi uchun)
exports.deleteQuote = async (req, res, next) => {
	try {
		const quote = await Quote.findById(req.params.id)
		if (!quote) throw CustomErrorHandler.NotFound('Iqtibos topilmadi')

		if (quote.addedBy.toString() !== req.user.id) {
			throw CustomErrorHandler.Forbidden("O'chirishga ruxsat yo'q")
		}

		await quote.deleteOne()
		res.status(200).json({ success: true, message: "O'chirildi" })
	} catch (error) {
		next(error)
	}
}

// 5. Layk bosish funksiyasi
exports.toggleLike = async (req, res, next) => {
	try {
		const quote = await Quote.findById(req.params.id)
		if (!quote) throw CustomErrorHandler.NotFound('Iqtibos topilmadi')

		const isLiked = quote.likes.includes(req.user.id)
		if (isLiked) {
			quote.likes = quote.likes.filter(id => id.toString() !== req.user.id)
		} else {
			quote.likes.push(req.user.id)
		}

		await quote.save()
		res.status(200).json({ success: true, likesCount: quote.likes.length })
	} catch (error) {
		next(error)
	}
}
