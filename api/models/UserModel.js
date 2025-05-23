const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, "Username é obrigatório"],
		minlength: [4, "Username deve ter pelo menos 4 caracteres"],
		maxlength: [20, "Username não pode exceder 20 caracteres"],
		unique: true,
		match: [
			/^[a-zA-Z0-9_]+$/,
			"Username pode conter apenas letras, números e underscores",
		],
	},
	password: {
		type: String,
		required: [true, "Senha é obrigatória"],
		minlength: [8, "Senha deve ter pelo menos 8 caracteres"],
	},
	active: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = model("User", UserSchema);
