const { Router } = require('express')
const quoteController = require('../controllers/quote.controller')
const authMiddleware = require('../middleware/authorization')

const router = Router()

// Hamma ko'ra oladi
router.get('/book/:bookId', quoteController.getQuotesByBook)

// Faqat login qilganlar uchun
router.use(authMiddleware)

router.post('/', quoteController.addQuote)
router.put('/:id', quoteController.updateQuote)
router.delete('/:id', quoteController.deleteQuote)
router.patch('/:id/like', quoteController.toggleLike)

module.exports = router
