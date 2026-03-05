const { Router } = require('express')
const {
	addBook,
	getOneBook,
	getAllBooks,
	updateBook,
	deleteBook,
	streamAudio,
	deleteAudio,
	uploadAudio,
} = require('../controllers/book.controller')
const bookValidationSchema = require('../validators/book.validator')
const validate = require('../middleware/validate.middleware')
const authMiddleware = require('../middleware/authorization')
const upload = require('../middleware/upload.audio')
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

bookRouter.post(
	'/:id/audio',
	authMiddleware,
	upload.single('audio'),
	uploadAudio,
)
bookRouter.get('/:id/stream', streamAudio)
bookRouter.delete('/:id/audio', authMiddleware, deleteAudio)

module.exports = bookRouter
