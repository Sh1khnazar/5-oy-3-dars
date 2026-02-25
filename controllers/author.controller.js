const Author = require('../models/author')
const CustomErrorHandler = require('../utils/custom-error.handler')

const addAuthor = async (req, res, next) => {
	try {
		const {
			firstName,
			lastName,
			dateOfBirth,
			dateOfDeath,
			country,
			bio,
			image,
		} = req.body

		const newAuthor = await Author.create({
			firstName,
			lastName,
			dateOfBirth,
			dateOfDeath,
			country,
			bio,
			image,
		})

		res.status(201).json({
			status: 'success',
			data: newAuthor,
		})
	} catch (error) {
		if (error.name === 'ValidationError') {
			return next(CustomErrorHandler.BadRequest(error.message))
		}
		next(error)
	}
}

const getOneAuthor = async (req, res, next) => {
	try {
		const { id } = req.params
		const foundAuthor = await Author.findById(id)

		if (!foundAuthor) {
			return next(CustomErrorHandler.NotFound('Muallif topilmadi'))
		}

		res.status(200).json({ status: 'success', data: foundAuthor })
	} catch (error) {
		if (error.name === 'CastError') {
			return next(CustomErrorHandler.BadRequest('ID formati notoʻgʻri'))
		}
		next(error)
	}
}

const getAllAuthors = async (req, res, next) => {
	try {
		const authors = await Author.find()
		res
			.status(200)
			.json({ status: 'success', results: authors.length, data: authors })
	} catch (error) {
		next(error)
	}
}

const updateAuthor = async (req, res, next) => {
	try {
		const { id } = req.params
		const updatedAuthor = await Author.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		})

		if (!updatedAuthor) {
			return next(
				CustomErrorHandler.NotFound('Yangilash uchun muallif topilmadi'),
			)
		}

		res.status(200).json({ status: 'success', data: updatedAuthor })
	} catch (error) {
		if (error.name === 'CastError') {
			return next(CustomErrorHandler.BadRequest('ID formati notoʻgʻri'))
		}
		next(error)
	}
}

const deleteAuthor = async (req, res, next) => {
	try {
		const { id } = req.params
		const deletedAuthor = await Author.findByIdAndDelete(id)

		if (!deletedAuthor) {
			return next(
				CustomErrorHandler.NotFound('Oʻchirish uchun muallif topilmadi'),
			)
		}

		res.status(200).json({ status: 'success', message: 'Muallif oʻchirildi' })
	} catch (error) {
		if (error.name === 'CastError') {
			return next(CustomErrorHandler.BadRequest('ID formati notoʻgʻri'))
		}
		next(error)
	}
}

module.exports = {
	addAuthor,
	getOneAuthor,
	getAllAuthors,
	updateAuthor,
	deleteAuthor,
}
