const { Router } = require('express')
const {
	addAuthor,
	getOneAuthor,
	getAllAuthors,
	updateAuthor,
	deleteAuthor,
} = require('../controllers/author.controller')

const authorRouter = Router()

authorRouter.post('/', addAuthor)
authorRouter.get('/', getAllAuthors)
authorRouter.get('/:id', getOneAuthor)
authorRouter.put('/:id', updateAuthor)
authorRouter.delete('/:id', deleteAuthor)

module.exports = authorRouter
