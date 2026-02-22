const Book = require('../models/book')

const addBook = async (req, res) => {
	try {
		const { title, pages, year, price, country, description, author } = req.body
		await Book.create({
			title,
			pages,
			year,
			price,
			country,
			description,
			author,
		})
		res.status(201).json({ message: 'Added new book' })
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

const getOneBook = async (req, res) => {
	try {
		const { id } = req.params
		const foundBook = await Book.findById(id)
		if (!foundBook) {
			return res.status(404).json({ message: 'Book not found' })
		}
		res.status(200).json(foundBook)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

const getAllBooks = async (req, res) => {
	try {
		const books = await Book.find()
		res.status(200).json(books)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const updateBook = async (req, res) => {
	try {
		const { id } = req.params
		const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
			new: true,
		})
		if (!updatedBook) {
			return res.status(404).json({ message: 'Book not found' })
		}
		res.status(200).json(updatedBook)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const deleteBook = async (req, res) => {
	try {
		const { id } = req.params
		const deletedBook = await Book.findByIdAndDelete(id)
		if (!deletedBook) {
			return res.status(404).json({ message: 'Book not found' })
		}
		res.status(200).json(deletedBook)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

module.exports = {
	addBook,
	getOneBook,
	getAllBooks,
	updateBook,
	deleteBook,
}
