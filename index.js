const express = require('express')
const cors = require('cors')
const connectToDB = require('./config/db')
const authorRouter = require('./routes/author.routes')
const bookRouter = require('./routes/book.routes')
require('dotenv').config()
const errorMiddleware = require('./middleware/error.middleware')
const authRouter = require('./routes/auth.routes')

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use('/api/authors', authorRouter)
app.use('/api/books', bookRouter)
app.use('/api/auth', authRouter)

app.use(errorMiddleware)

async function startServer() {
	try {
		await connectToDB()

		app.listen(PORT, () => {
			console.log('Server is running at:', PORT)
		})
	} catch (error) {
		console.error('Failed to start server:', error.message)
		process.exit(1)
	}
}

startServer()
