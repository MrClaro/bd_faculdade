# Projeto de Banco de Dados - UNIFIO

Repositório criado para a apresentação da disciplina de **Design e Desenvolvimento de Banco de Dados** da faculdade **UNIFIO**.

Este projeto utiliza **MongoDB** como banco de dados NoSQL e foi desenvolvido com foco em aprendizado e demonstração de conceitos fundamentais.

---

## 🚀 Como executar o projeto

Siga os passos abaixo para clonar e rodar o projeto na sua máquina:

### 1. Clone o repositório

```bash
git clone https://github.com/MrClaro/bd_faculdade.git
```

### 2. Acesse a pasta do projeto
```bash
cd bd_faculdade/api
```

### 3. Instale as dependências
```bash
npm install
```

### 4. Configure as variáveis de ambiente
Altere no arquivo .env na raiz da pasta api o seguinte conteúdo:
```bash
MONGODB_URI=""
JWT_SECRET=""
```
 - ⚠️ Importante: Substitua os valores entre aspas pelas suas próprias credenciais.

### 5. Inicie o servidor
```bash
npm start
```

### 6. Acesse a documentação Swagger
- Após iniciar o servidor, acesse:
- http://localhost:4000/docs

### 🧰 Tecnologias utilizadas
- Node.js
- Express
- MongoDB (via Mongoose)
- JWT para autenticação
- bcryptjs para hashing de senhas
- dotenv para variáveis de ambiente
- cookie-parser e cors para suporte ao ambiente web

### 🌐 Site oficial do MongoDBb
- [mongodb](https://www.mongodb.com/)


### 📚 Objetivo

Este projeto tem como finalidade mostrar, de forma prática, como funciona o uso de bancos de dados NoSQL em uma API com autenticação e persistência de dados.
