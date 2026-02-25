const { Schema, model } = require('mongoose')

const authorSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Ism kiritilishi shart'],
			trim: true,
			minlength: [2, 'Ism juda qisqa'],
			maxlength: [50, 'Ism juda uzun'],
		},
		lastName: {
			type: String,
			required: [true, 'Familiya kiritilishi shart'],
			trim: true,
			minlength: [2, 'Familiya juda qisqa'],
		},
		dateOfBirth: {
			type: Number,
			required: [true, "Tug'ilgan yil kiritilishi shart"],
			min: [1000, "Tug'ilgan yil mantiqsiz"],
			max: [
				new Date().getFullYear(),
				"Tug'ilgan yil kelajakda bo'lishi mumkin emas",
			],
		},
		dateOfDeath: {
			type: Number,
			default: null,
			validate: {
				validator: function (value) {
					if (value === null) return true
					return value >= this.dateOfBirth
				},
				message: "O'lim yili tug'ilgan yildan oldin bo'lishi mumkin emas!",
			},
		},
		country: {
			type: String,
			required: [true, 'Davlat nomi kiritilishi shart'],
			trim: true,
		},
		bio: {
			type: String,
			required: [true, "Biografiya bo'sh bo'lishi mumkin emas"],
			minlength: [10, 'Biografiya juda qisqa'],
		},
		image: {
			type: String,
			default: 'default-author.png',
		},
	},
	{
		timestamps: true,
	},
)

module.exports = model('Author', authorSchema)
