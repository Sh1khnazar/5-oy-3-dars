const User = require('../models/user')
const { generateTokens } = require('../utils/token')
const CustomErrorHandler = require('../utils/custom-error.handler')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/send-email')

// 1. Register
const register = async (req, res, next) => {
	try {
		const { username, email, password } = req.body
		const existingUser = await User.findOne({ email })
		if (existingUser)
			throw CustomErrorHandler.BadRequest('Email already exists')

		const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
		const otpExpires = new Date(Date.now() + 5 * 60 * 1000)

		const user = await User.create({
			username,
			email,
			password,
			otp: { code: otpCode, expiresAt: otpExpires },
		})

		await sendEmail({
			email: user.email,
			subject: 'Devbook OTP',
			message: `Sizning OTP kodingiz: ${otpCode}. Kod 5 daqiqa ichida amal qiladi.`,
		})

		res.status(201).json({ success: true, message: 'OTP sent' })
	} catch (error) {
		next(error)
	}
}

// 2. Verify
const verify = async (req, res, next) => {
	try {
		const { email, code } = req.body
		const user = await User.findOne({ email })

		if (!user) throw CustomErrorHandler.BadRequest('User not found')
		if (!user.otp || user.otp.code !== code)
			throw CustomErrorHandler.Unauthorized('Wrong code')
		if (user.otp.expiresAt < Date.now())
			throw CustomErrorHandler.Unauthorized('Expired')

		user.isVerified = true
		user.otp = undefined

		const { accessToken, refreshToken } = generateTokens(user._id)
		user.refreshToken = refreshToken
		await user.save()

		// Refresh tokenni cookie-ga joylaymiz
		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		res
			.status(200)
			.json({ success: true, accessToken, message: 'Verified and Logged in' })
	} catch (error) {
		next(error)
	}
}

// 3. Login
const login = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email }).select('+password')

		if (!user) throw CustomErrorHandler.Unauthorized('Invalid credentials')
		const isMatch = await user.correctPassword(password, user.password)
		if (!isMatch) throw CustomErrorHandler.Unauthorized('Invalid credentials')
		if (!user.isVerified) throw CustomErrorHandler.Forbidden('Not verified')

		const { accessToken, refreshToken } = generateTokens(user._id)
		user.refreshToken = refreshToken
		await user.save()

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		res.status(200).json({ success: true, accessToken })
	} catch (error) {
		next(error)
	}
}

// 4. Refresh Token
const refreshTokenController = async (req, res, next) => {
	try {
		const { refresh_token } = req.cookies
		if (!refresh_token) throw CustomErrorHandler.BadRequest('Token required')

		let decoded
		try {
			decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET)
		} catch (err) {
			throw CustomErrorHandler.Unauthorized('Invalid refresh token')
		}

		const user = await User.findById(decoded.id).select('+refreshToken')
		if (!user || user.refreshToken !== refresh_token) {
			throw CustomErrorHandler.Unauthorized('Invalid token')
		}

		const tokens = generateTokens(user._id)
		user.refreshToken = tokens.refreshToken
		await user.save()

		res.cookie('refresh_token', tokens.refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		res.status(200).json({ success: true, accessToken: tokens.accessToken })
	} catch (error) {
		next(error)
	}
}

// 5. Logout (Cookie va Bazani tozalaydi)
const logout = async (req, res, next) => {
	try {
		const { refresh_token } = req.cookies

		// Bazadagi tokenni o'chirish
		if (refresh_token) {
			await User.findOneAndUpdate(
				{ refreshToken: refresh_token },
				{ refreshToken: null },
			)
		}

		// Cookieni o'chirish
		res.clearCookie('refresh_token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		})

		res.status(200).json({ success: true, message: 'Logged out' })
	} catch (error) {
		next(error)
	}
}

module.exports = {
	register,
	verify,
	login,
	refreshToken: refreshTokenController,
	logout,
}
