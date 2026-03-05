const Book = require('../models/book')
const fs = require('fs')
const path = require('path')
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

		const foundBook = await Book.findById(id)

		if (!foundBook) {
			return next(
				CustomErrorHandler.NotFound('Oʻchirish uchun kitob topilmadi'),
			)
		}

		if (foundBook.audioUrl) {
			const audioPath = path.join(__dirname, '..', foundBook.audioUrl)

			if (fs.existsSync(audioPath)) {
				fs.unlinkSync(audioPath)
			}
		}

		await Book.findByIdAndDelete(id)

		res.status(200).json({
			status: 'success',
			message: 'Kitob va unga tegishli audio fayl muvaffaqiyatli oʻchirildi',
		})
	} catch (error) {
		if (error.name === 'CastError') {
			return next(CustomErrorHandler.BadRequest('ID formati notoʻgʻri'))
		}
		next(error)
	}
}

// 1. Audio yuklash va bazaga ulab qo'yish
const uploadAudio = async (req, res, next) => {
	try {
		const { id } = req.params

		if (!req.file) {
			return next(CustomErrorHandler.BadRequest('Fayl yuklanmadi!'))
		}

		const book = await Book.findById(id)
		if (!book) {
			if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
			return next(CustomErrorHandler.NotFound('Kitob topilmadi!'))
		}

		if (book.audioUrl) {
			const oldPath = path.join(__dirname, '..', book.audioUrl)
			if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
		}

		book.audioUrl = `/uploads/audio/${req.file.filename}`
		await book.save()

		res.status(200).json({ status: 'success', data: book })
	} catch (error) {
		if (req.file) fs.unlinkSync(req.file.path)
		next(error)
	}
}

// 2. Audioni oqimli (stream) uzatish
const streamAudio = async (req, res, next) => {
	try {
		const book = await Book.findById(req.params.id)
		if (!book || !book.audioUrl)
			return next(CustomErrorHandler.NotFound('Audio yoq'))

		const audioPath = path.join(__dirname, '..', book.audioUrl)
		const stat = fs.statSync(audioPath)
		const fileSize = stat.size
		const range = req.headers.range

		if (range) {
			const parts = range.replace(/bytes=/, '').split('-')
			const start = parseInt(parts[0], 10)
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
			const chunksize = end - start + 1
			const file = fs.createReadStream(audioPath, { start, end })

			res.writeHead(206, {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': 'audio/mpeg',
			})
			file.pipe(res)
		} else {
			res.writeHead(200, {
				'Content-Length': fileSize,
				'Content-Type': 'audio/mpeg',
			})
			fs.createReadStream(audioPath).pipe(res)
		}
	} catch (error) {
		next(error)
	}
}

const deleteAudio = async (req, res, next) => {
	try {
		const { id } = req.params

		const book = await Book.findById(id)

		// 1. Kitobni tekshirish
		if (!book) {
			return next(CustomErrorHandler.NotFound('Kitob topilmadi!'))
		}

		// 2. Audio borligini tekshirish
		if (!book.audioUrl) {
			return next(
				CustomErrorHandler.BadRequest(
					'Bu kitobda o‘chirish uchun audio mavjud emas!',
				),
			)
		}

		// 3. Fizik faylni o'chirish
		const audioPath = path.join(__dirname, '..', book.audioUrl)
		if (fs.existsSync(audioPath)) {
			fs.unlinkSync(audioPath)
		}

		// 4. Bazadagi linkni o'chirish
		book.audioUrl = '' // yoki undefined
		await book.save()

		res.status(200).json({
			status: 'success',
			message: 'Audio fayl muvaffaqiyatli o‘chirildi',
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	addBook,
	getOneBook,
	getAllBooks,
	updateBook,
	deleteBook,
	uploadAudio,
	streamAudio,
	deleteAudio,
}
