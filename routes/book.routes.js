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
const authMiddleware = require('../middleware/authorization')
const bookRouter = Router()

bookRouter.post('/', authMiddleware, validate(bookValidationSchema), addBook)
bookRouter.get('/', getAllBooks)
bookRouter.get('/:id', getOneBook)
bookRouter.put(
	'/:id',
	authMiddleware,
	validate(bookValidationSchema),
	updateBook,
)
bookRouter.delete('/:id', authMiddleware, deleteBook)

module.exports = bookRouter
