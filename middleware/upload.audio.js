const multer = require('multer')
const path = require('path')
const fs = require('fs')

// 1. Papka mavjudligini tekshirish (agar bo'lmasa yaratadi)
const uploadDir = 'uploads/audio'
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true })
}

// 2. Storage (Saqlash) sozlamalari
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir) // Fayl qayerga tushishi
	},
	filename: (req, file, cb) => {
		// Fayl nomini unikal qilish (masalan: audio-1712345678.mp3)
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(
			null,
			file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
		)
	},
})

// 3. Fayl turini saralash (faqat audio fayllar uchun)
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('audio/')) {
		cb(null, true)
	} else {
		cb(new Error('Faqat audio fayllar yuklash ruxsat etilgan!'), false)
	}
}

// 4. Multer obyektini yaratish
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // Maksimal 10 MB
	},
})

// MUHIM: Faqat upload'ni o'zini eksport qilamiz
module.exports = upload
