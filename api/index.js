require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/UserModel");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// swagger
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// Configurações
const saltRounds = 10;
const secret = process.env.JWT_SECRET || "fallbackSecret";
const port = process.env.PORT || 4000;

// Middlewares
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
	}),
);
app.use(express.json());
app.use(cookieParser());

// Conexão com MongoDB (NoSQL)
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Conectado ao MongoDB!"))
	.catch((err) => console.error("Erro na conexão:", err));

/**
 * Rota de Registro - Demonstra:
 * - Criptografia de senha com bcrypt
 * - Criação de documentos NoSQL
 * - Validação de esquema com Mongoose
 */
app.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;

		const userExists = await User.findOne({ username });
		if (userExists) {
			return res.status(400).json({ message: "Username já está em uso" });
		}

		const userDoc = await User.create({
			username,
			password: await bcrypt.hash(password, saltRounds),
		});

		res.status(201).json({
			id: userDoc._id,
			username: userDoc.username,
			createdAt: userDoc.createdAt,
		});
	} catch (error) {
		console.error("Erro no registro:", error);
		res.status(500).json({
			message: "Erro no cadastro",
			error: error.message,
			errorCode: "REGISTER_ERROR",
		});
	}
});

/**
 * Rota de Login - Demonstra:
 * - Comparação de hash com bcrypt
 * - Geração de JWT
 * - Uso de cookies HTTP-only
 */
app.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const userDoc = await User.findOne({ username });

		if (!userDoc || !bcrypt.compareSync(password, userDoc.password)) {
			return res.status(401).json({ message: "Credenciais inválidas" });
		}

		const token = jwt.sign({ id: userDoc._id, username }, secret, {
			expiresIn: "1d",
		});

		res
			.cookie("token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 86400000, // 1 dia
			})
			.json({
				id: userDoc._id,
				username,
				message: "Login bem-sucedido",
			});
	} catch (error) {
		console.error("Erro no login:", error);
		res.status(500).json({
			message: "Erro no login",
			errorCode: "LOGIN_ERROR",
		});
	}
});

/**
 * Rota de Perfil - Demonstra:
 * - Verificação de JWT
 * - Acesso a dados protegidos
 */
app.get("/profile", (req, res) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ message: "Não autenticado" });

	jwt.verify(token, secret, (err, decoded) => {
		if (err) return res.status(401).json({ message: "Token inválido" });
		res.json(decoded);
	});
});

/**
 * Rota de Logout - Demonstra:
 * - Invalidação de cookie
 */
app.post("/logout", (req, res) => {
	res.clearCookie("token").json({ message: "Logout realizado" });
});

/**
 * Rota de Usuários - Demonstra:
 * - Consulta NoSQL com Mongoose
 * - Projeção de campos sensíveis
 */
app.get("/users", async (req, res) => {
	try {
		const users = await User.find()
			.where({ active: true })
			.select("-password -__v")
			.sort({ createdAt: -1 })
			.lean();

		res.json(users);
	} catch (error) {
		console.error("Erro ao buscar usuários:", error);
		res.status(500).json({
			message: "Erro na consulta",
			errorCode: "USER_QUERY_ERROR",
		});
	}
});

/**
 * Rota de desativação de usuário - Demonstra:
 * - Atualização de documento NoSQL
 */
app.put("/users/:id/deactivate", async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findByIdAndUpdate(
			id,
			{ active: false },
			{ new: true },
		);
		if (!user)
			return res.status(404).json({ message: "Usuário não encontrado" });
		res.json({ message: "Usuário desativado" });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Erro ao desativar o usuário", error: err.message });
	}
});

/**
 * Swagger - Rota de documentação
 */
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
