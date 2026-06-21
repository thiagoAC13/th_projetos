# 🚀 Guia Rápido de Instalação

## Para Quem Tem Pressa

### 1️⃣ Instale o PostgreSQL

**Windows:**
- Baixe em: https://www.postgresql.org/download/windows/
- Durante instalação, defina senha para usuário `postgres`
- Anote a senha!

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2️⃣ Crie o Banco de Dados

```bash
# Acesse o PostgreSQL
psql -U postgres

# Dentro do PostgreSQL, execute:
CREATE DATABASE anime_manager;
\q
```

### 3️⃣ Execute o Schema

```bash
psql -U postgres -d anime_manager -f database/schema.sql
```

### 4️⃣ Configure o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI
DB_NAME=anime_manager
PORT=3000
```

### 5️⃣ Inicie o Servidor

```bash
npm start
```

### 6️⃣ Abra o Frontend

Abra o arquivo `frontend/index.html` no navegador!

---

## ⚡ Usando Docker (Mais Fácil!)

Se você tem Docker instalado:

```bash
# 1. Inicie PostgreSQL
docker run --name postgres-anime \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=anime_manager \
  -p 5432:5432 \
  -d postgres

# 2. Execute o schema
docker exec -i postgres-anime psql -U postgres -d anime_manager < database/schema.sql

# 3. Configure o .env com:
DB_PASSWORD=123456

# 4. Inicie o backend
cd backend
npm install
npm start

# 5. Abra frontend/index.html no navegador
```

---

## ✅ Verificar se está funcionando

1. Acesse: http://localhost:3000/api/health
   - Deve mostrar: `"success": true, "database": "conectado"`

2. Abra o frontend
   - Deve mostrar: 🟢 Conectado ao servidor PostgreSQL

---

## ❌ Problemas Comuns

**"Não conecta ao PostgreSQL"**
- Verifique se PostgreSQL está rodando
- Confira usuário e senha no .env
- Teste: `psql -U postgres -d anime_manager`

**"Cannot find module"**
```bash
cd backend
rm -rf node_modules
npm install
```

**"CORS error no navegador"**
- Certifique-se que o backend está rodando
- Verifique se a porta é 3000

---

## 📞 Precisa de Ajuda?

1. Verifique o arquivo README.md completo
2. Confirme que PostgreSQL está instalado: `psql --version`
3. Confirme que Node.js está instalado: `node --version`
4. Verifique os logs do servidor para erros

---

**Pronto! Agora você tem um gerenciador de animes com banco de dados real! 🎌**
