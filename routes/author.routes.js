const { Router } = require('express')
const {
  addAuthor,
  getOneAuthor,
  getAllAuthors,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/author.controller')

// 1. Validator va Middleware-ni import qilamiz
const validate = require('../middleware/validate.middleware')
const authorSchema = require('../validators/author.validator')

const authorRouter = Router()

// 2. POST so'roviga validatsiyani qo'shamiz
authorRouter.post('/', validate(authorSchema), addAuthor)

authorRouter.get('/', getAllAuthors)
authorRouter.get('/:id', getOneAuthor)

// 3. PUT so'roviga ham validatsiyani qo'shish tavsiya etiladi
// Chunki ma'lumot yangilanayotganda ham format buzilmasligi kerak
authorRouter.put('/:id', validate(authorSchema), updateAuthor)

authorRouter.delete('/:id', deleteAuthor)

module.exports = authorRouter