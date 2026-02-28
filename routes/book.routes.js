const { Router } = require('express')
const {
	addBook,
	getOneBook,
	getAllBooks,
	updateBook,
	deleteBook,
} = require('../controllers/book.controller')
const bookValidationSchema = require('../validators/book.validator')
const validate = require('../middleware/validate.middleware')
const bookRouter = Router()

bookRouter.post('/', validate(bookValidationSchema), addBook)
bookRouter.get('/', getAllBooks)
bookRouter.get('/:id', getOneBook)
bookRouter.put('/:id', validate(bookValidationSchema), updateBook)
bookRouter.delete('/:id', deleteBook)

module.exports = bookRouter
