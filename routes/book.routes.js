const { Router } = require('express')
const {
	addBook,
	getOneBook,
	getAllBooks,
	updateBook,
	deleteBook,
} = require('../controllers/book.controller')

const bookRouter = Router()

bookRouter.post('/', addBook)
bookRouter.get('/', getAllBooks)
bookRouter.get('/:id', getOneBook)
bookRouter.put('/:id', updateBook)
bookRouter.delete('/:id', deleteBook)

module.exports = bookRouter
