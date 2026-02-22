const Author = require('../models/author')

const addAuthor = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			dateOfBirth,
			dateOfDeath,
			country,
			bio,
			image,
		} = req.body
		await Author.create({
			firstName,
			lastName,
			dateOfBirth,
			dateOfDeath,
			country,
			bio,
			image,
		})
		res.status(201).json({ message: 'Added new author' })
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}
const getOneAuthor = async (req, res) => {
	try {
		const { id } = req.params
		const foundAuthor = await Author.findById(id)
		if (!foundAuthor) {
			return res.status(404).json({
				message: 'Author not found',
			})
		}
		res.status(200).json(foundAuthor)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

const getAllAuthors = async (req, res) => {
	try {
		const authors = await Author.find()
		res.status(200).json(authors)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const updateAuthor = async (req, res) => {
	try {
		const { id } = req.params
		const updatedAuthor = await Author.findByIdAndUpdate(id, req.body, {
			new: true,
		})
		if (!updatedAuthor) {
			return res.status(404).json({ message: 'Author not found' })
		}
		res.status(200).json(updatedAuthor)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const deleteAuthor = async (req, res) => {
	try {
		const { id } = req.params
		const deletedAuthor = await Author.findByIdAndDelete(id)
		if (!deletedAuthor) {
			return res.status(404).json({
				message: 'Author not found',
			})
		}
		res.status(200).json(deletedAuthor)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

module.exports = {
	addAuthor,
	getOneAuthor,
	getAllAuthors,
	updateAuthor,
	deleteAuthor,
}
