const Book = require('../models/book')
const CustomErrorHandler = require('../utils/custom-error.handler')

const addBook = async (req, res, next) => {
	try {
		const { title, pages, year, price, country, description, author } = req.body

		const newBook = await Book.create({
			title,
			pages,
			year,
			price,
			country,
			description,
			author,
		})

		res.status(201).json({
			status: 'success',
			data: newBook,
		})
	} catch (error) {
		if (error.name === 'ValidationError') {
			return next(CustomErrorHandler.BadRequest(error.message))
		}
		next(error)
	}
}

const getOneBook = async (req, res, next) => {
	try {
		const { id } = req.params
		const foundBook = await Book.findById(id).populate(
			'author',
			'-_id firstName lastName',
		)

		if (!foundBook) {
			return next(CustomErrorHandler.NotFound('Kitob topilmadi'))
		}

		res.status(200).json({
			status: 'success',
			data: foundBook,
		})
	} catch (error) {
		if (error.name === 'CastError') {
			return next(CustomErrorHandler.BadRequest('ID formati notoʻgʻri'))
		}
		next(error)
	}
}

const getAllBooks = async (req, res, next) => {
	try {
		const books = await Book.find().populate(
			'author',
			'-_id firstName lastName',
		)

		res.status(200).json({
			status: 'success',
			results: books.length,
			data: books,
		})
	} catch (error) {
		next(error)
	}
}

const updateBook = async (req, res, next) => {
	try {
		const { id } = req.params
		const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		})

		if (!updatedBook) {
			return next(
				CustomErrorHandler.NotFound('Yangilash uchun kitob topilmadi'),
			)
		}

		res.status(200).json({
			status: 'success',
			data: updatedBook,
		})
	} catch (error) {
		if (error.name === 'CastError') {
			return next(CustomErrorHandler.BadRequest('ID formati notoʻgʻri'))
		}
		next(error)
	}
}

const deleteBook = async (req, res, next) => {
	try {
		const { id } = req.params
		const deletedBook = await Book.findByIdAndDelete(id)

		if (!deletedBook) {
			return next(
				CustomErrorHandler.NotFound('Oʻchirish uchun kitob topilmadi'),
			)
		}

		res.status(200).json({
			status: 'success',
			message: 'Kitob oʻchirildi',
		})
	} catch (error) {
		if (error.name === 'CastError') {
			return next(CustomErrorHandler.BadRequest('ID formati notoʻgʻri'))
		}
		next(error)
	}
}

module.exports = {
	addBook,
	getOneBook,
	getAllBooks,
	updateBook,
	deleteBook,
}
