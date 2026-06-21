# 🎌 Gerenciador de Animes com PostgreSQL

Sistema completo para gerenciar sua coleção de animes com backend Node.js, Express e banco de dados PostgreSQL.

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)

## ✨ Características

### Frontend
- ✅ Interface moderna e responsiva
- ✅ Upload de imagens locais ou URL
- ✅ Categorização por status (Acompanhando, Já Visto, Assistir Futuramente)
- ✅ Sistema de favoritos
- ✅ Busca em tempo real
- ✅ Filtros avançados
- ✅ Ordenação múltipla
- ✅ Edição e exclusão de animes

### Backend
- ✅ API RESTful completa
- ✅ Banco de dados PostgreSQL
- ✅ Validação de dados
- ✅ Suporte para imagens Base64
- ✅ Sistema de logs
- ✅ Tratamento de erros
- ✅ CORS configurável

## 🛠️ Tecnologias

### Backend
- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- dotenv
- cors
- body-parser

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 14 ou superior)
   - Download: https://nodejs.org/

2. **PostgreSQL** (versão 12 ou superior)
   - Download: https://www.postgresql.org/download/
   - Ou use Docker: `docker run --name postgres-anime -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres`

3. **npm** (geralmente vem com Node.js)

## 🚀 Instalação

### 1. Clone ou baixe o projeto

```bash
# Crie uma pasta para o projeto
mkdir anime-manager
cd anime-manager
```

### 2. Configure o Banco de Dados PostgreSQL

#### Opção A: PostgreSQL Local

```bash
# Conecte ao PostgreSQL
psql -U postgres

# No console do PostgreSQL, execute:
CREATE DATABASE anime_manager;
\c anime_manager
```

#### Opção B: PostgreSQL com Docker

```bash
# Inicie o container PostgreSQL
docker run --name postgres-anime \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=anime_manager \
  -p 5432:5432 \
  -d postgres

# Acesse o container
docker exec -it postgres-anime psql -U postgres -d anime_manager
```

### 3. Execute o Schema SQL

Copie o conteúdo do arquivo `database/schema.sql` e execute no PostgreSQL:

```bash
psql -U postgres -d anime_manager -f database/schema.sql
```

### 4. Instale as Dependências do Backend

```bash
cd backend
npm install
```

## ⚙️ Configuração

### 1. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=anime_manager

# Configurações do Servidor
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=*
```

### 2. Configure a URL da API no Frontend

Edite o arquivo `frontend/index.html` e verifique se a URL da API está correta (linha ~420):

```javascript
const API_URL = 'http://localhost:3000/api';
```

## 🎮 Uso

### 1. Inicie o Servidor Backend

```bash
cd backend
npm start

# Ou use nodemon para desenvolvimento (reinicia automaticamente)
npm run dev
```

Você verá:
```
╔════════════════════════════════════════╗
║  🎌 Anime Manager API                  ║
║  ✅ Servidor rodando na porta 3000     ║
║  🌐 http://localhost:3000              ║
║  📚 Documentação: /api/health          ║
╚════════════════════════════════════════╝
```

### 2. Abra o Frontend

Simplesmente abra o arquivo `frontend/index.html` no seu navegador:

```bash
# No Windows
start frontend/index.html

# No Mac
open frontend/index.html

# No Linux
xdg-open frontend/index.html
```

Ou sirva com um servidor HTTP:

```bash
# Usando Python 3
cd frontend
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server frontend -p 8000
```

Acesse: `http://localhost:8000`

## 📡 API Endpoints

### Animes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/animes` | Lista todos os animes (com filtros opcionais) |
| GET | `/api/animes/:id` | Busca anime específico |
| POST | `/api/animes` | Cria novo anime |
| PUT | `/api/animes/:id` | Atualiza anime completo |
| PATCH | `/api/animes/:id/favorite` | Alterna favorito |
| PATCH | `/api/animes/:id/status` | Atualiza status |
| DELETE | `/api/animes/:id` | Deleta anime |

### Outros

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/stats` | Estatísticas gerais |
| GET | `/api/health` | Status da API e BD |

### Exemplos de Uso

#### Listar animes com filtros

```bash
# Todos os animes
curl http://localhost:3000/api/animes

# Apenas assistindo
curl http://localhost:3000/api/animes?status=acompanhando

# Apenas favoritos
curl http://localhost:3000/api/animes?favorite=true

# Buscar por nome
curl http://localhost:3000/api/animes?search=naruto

# Ordenar por favoritos
curl http://localhost:3000/api/animes?sortBy=favorites
```

#### Criar novo anime

```bash
curl -X POST http://localhost:3000/api/animes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Naruto",
    "image": "https://exemplo.com/naruto.jpg",
    "status": "acompanhando",
    "favorite": false
  }'
```

#### Atualizar anime

```bash
curl -X PUT http://localhost:3000/api/animes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Naruto Shippuden",
    "status": "visto"
  }'
```

#### Alternar favorito

```bash
curl -X PATCH http://localhost:3000/api/animes/1/favorite
```

#### Deletar anime

```bash
curl -X DELETE http://localhost:3000/api/animes/1
```

## 📁 Estrutura do Projeto

```
anime-manager/
├── backend/
│   ├── config/
│   │   └── database.js      # Configuração do PostgreSQL
│   ├── .env                 # Variáveis de ambiente (criar)
│   ├── .env.example         # Exemplo de .env
│   ├── package.json         # Dependências do projeto
│   └── server.js            # Servidor Express e rotas
│
├── database/
│   └── schema.sql           # Schema do banco de dados
│
├── frontend/
│   └── index.html           # Interface do usuário
│
└── README.md                # Este arquivo
```

## 🔧 Troubleshooting

### Erro: "não foi possível conectar ao servidor"

1. Verifique se o PostgreSQL está rodando:
```bash
# Linux/Mac
sudo service postgresql status

# Windows
# Verifique no Gerenciador de Serviços
```

2. Verifique as credenciais no arquivo `.env`

3. Teste a conexão:
```bash
psql -U postgres -d anime_manager
```

### Erro: "CORS policy"

Certifique-se de que o backend está rodando e que a variável `CORS_ORIGIN` está configurada corretamente.

### Erro: "Cannot find module"

Execute novamente:
```bash
cd backend
npm install
```

### Banco de dados não cria tabelas

Execute manualmente:
```bash
psql -U postgres -d anime_manager -f database/schema.sql
```

## 🎯 Próximos Passos

- [ ] Adicionar autenticação de usuários
- [ ] Implementar upload de imagens para servidor
- [ ] Adicionar tags/categorias personalizadas
- [ ] Sistema de avaliação (notas/estrelas)
- [ ] Exportar/importar lista em JSON
- [ ] Deploy em produção (Heroku, Railway, etc)
- [ ] Aplicativo mobile (React Native)

## 📄 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Desenvolvido com ❤️ para otakus que amam organização!
