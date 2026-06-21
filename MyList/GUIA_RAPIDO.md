# 🎯 GUIA RÁPIDO DE REFERÊNCIA

## ⚡ Comandos Principais

### Iniciar o Sistema

```bash
# 1. Abrir PostgreSQL (se não estiver rodando)
# Windows: Abrir "SQL Shell (psql)" do menu Iniciar
# Mac/Linux:
sudo systemctl start postgresql

# 2. Iniciar o Servidor Backend
cd anime-manager/backend
npm start

# 3. Abrir o Frontend
# Apenas dar duplo clique em: frontend/index.html
```

---

## 🗄️ Comandos PostgreSQL Úteis

### Entrar no PostgreSQL
```bash
psql -U postgres -d anime_manager
```

### Comandos Básicos no psql
```sql
\l                          -- Listar todos os bancos de dados
\c anime_manager           -- Conectar ao banco anime_manager
\dt                        -- Listar todas as tabelas
\d animes                  -- Ver estrutura da tabela animes
\q                         -- Sair do psql
```

### Consultas Úteis
```sql
-- Ver todos os animes
SELECT * FROM animes;

-- Ver apenas nomes e status
SELECT name, status FROM animes;

-- Ver favoritos
SELECT name FROM animes WHERE favorite = true;

-- Contar animes por status
SELECT status, COUNT(*) FROM animes GROUP BY status;

-- Ver os 5 últimos animes adicionados
SELECT name, added_at FROM animes ORDER BY added_at DESC LIMIT 5;

-- Buscar anime por nome
SELECT * FROM animes WHERE name ILIKE '%naruto%';

-- Deletar anime específico
DELETE FROM animes WHERE id = 1;

-- Atualizar status de um anime
UPDATE animes SET status = 'visto' WHERE id = 1;

-- Marcar como favorito
UPDATE animes SET favorite = true WHERE id = 1;
```

---

## 🌐 Endpoints da API

### Base URL
```
http://localhost:3000/api
```

### Listar Animes
```bash
# Todos os animes
curl http://localhost:3000/api/animes

# Com filtros
curl "http://localhost:3000/api/animes?status=acompanhando"
curl "http://localhost:3000/api/animes?favorite=true"
curl "http://localhost:3000/api/animes?search=naruto"
curl "http://localhost:3000/api/animes?sortBy=favorites"
```

### Criar Anime
```bash
curl -X POST http://localhost:3000/api/animes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Anime",
    "image": "https://exemplo.com/imagem.jpg",
    "status": "acompanhando",
    "favorite": false
  }'
```

### Atualizar Anime
```bash
curl -X PUT http://localhost:3000/api/animes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome Atualizado",
    "status": "visto"
  }'
```

### Alternar Favorito
```bash
curl -X PATCH http://localhost:3000/api/animes/1/favorite
```

### Deletar Anime
```bash
curl -X DELETE http://localhost:3000/api/animes/1
```

### Ver Estatísticas
```bash
curl http://localhost:3000/api/stats
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

---

## 🔧 Solução Rápida de Problemas

### Servidor não inicia?
```bash
# Verificar se Node.js está instalado
node --version
npm --version

# Reinstalar dependências
cd backend
rm -rf node_modules
npm install
```

### PostgreSQL não conecta?
```bash
# Windows - Verificar se está rodando
services.msc
# Procurar: postgresql-x64-15

# Mac/Linux - Verificar status
sudo systemctl status postgresql

# Iniciar PostgreSQL
# Windows: services.msc > postgresql > Iniciar
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Erro no banco de dados?
```bash
# Testar conexão
psql -U postgres -d anime_manager

# Recriar tabelas
psql -U postgres -d anime_manager -f database/schema.sql
```

### Site não carrega?
```bash
# 1. Verificar se backend está rodando
curl http://localhost:3000/api/health

# 2. Se não, iniciar:
cd backend
npm start

# 3. Abrir frontend novamente
```

---

## 📝 Atalhos do Teclado (no Frontend)

- **Ctrl + F** ou **Cmd + F** - Focar na busca
- **F5** - Recarregar página
- **F12** - Abrir console do desenvolvedor (para debug)

---

## 🎨 Estrutura de Status

| Status | Cor | Significado |
|--------|-----|-------------|
| acompanhando | Verde | Assistindo atualmente |
| visto | Azul | Já assistiu completo |
| futuro | Amarelo | Quer assistir |

---

## 💾 Backup e Restauração

### Fazer Backup
```bash
# Backup completo
pg_dump -U postgres anime_manager > backup_$(date +%Y%m%d).sql

# Backup apenas dados
pg_dump -U postgres --data-only anime_manager > dados_$(date +%Y%m%d).sql
```

### Restaurar Backup
```bash
# Restaurar completo
psql -U postgres anime_manager < backup_20240215.sql

# Restaurar apenas dados
psql -U postgres anime_manager < dados_20240215.sql
```

---

## 🔐 Segurança

### Alterar Senha do PostgreSQL
```sql
-- Conectar ao psql
psql -U postgres

-- Alterar senha
\password postgres
-- Digite a nova senha duas vezes

\q
```

### Atualizar .env
```bash
# Editar arquivo backend/.env
# Alterar linha:
DB_PASSWORD=nova_senha_aqui
```

---

## 📊 Logs e Debug

### Ver Logs do Servidor
```bash
# Logs aparecem no terminal onde rodou npm start
# Procurar por:
# ✅ Query executada: ...
# ❌ Erro ao ... : ...
```

### Ver Logs do PostgreSQL

**Windows:**
```
C:\Program Files\PostgreSQL\15\data\log\
```

**Mac (Homebrew):**
```
/usr/local/var/log/postgres.log
```

**Linux:**
```
/var/log/postgresql/
```

---

## 🚀 Melhorias Futuras

### Adicionar Novo Campo
1. Editar `database/schema.sql`
2. Adicionar coluna:
```sql
ALTER TABLE animes ADD COLUMN nota INTEGER;
```
3. Atualizar `backend/server.js` para aceitar novo campo
4. Atualizar `frontend/index.html` para exibir/editar

### Mudar Porta do Servidor
1. Editar `backend/.env`:
```env
PORT=5000
```
2. Editar `frontend/index.html`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## 📱 URLs Importantes

| Serviço | URL |
|---------|-----|
| Frontend | `file:///caminho/para/frontend/index.html` |
| API Health | http://localhost:3000/api/health |
| API Animes | http://localhost:3000/api/animes |
| API Stats | http://localhost:3000/api/stats |

---

## 🆘 Comandos de Emergência

### Resetar Tudo
```bash
# CUIDADO! Apaga todos os dados!

# Conectar ao PostgreSQL
psql -U postgres

# Dropar e recriar banco
DROP DATABASE anime_manager;
CREATE DATABASE anime_manager;
\c anime_manager

# Recriar tabelas
\i /caminho/para/database/schema.sql
```

### Limpar Cache do npm
```bash
cd backend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Checklist de Funcionamento

- [ ] PostgreSQL instalado e rodando
- [ ] Node.js instalado (v14+)
- [ ] Banco `anime_manager` criado
- [ ] Tabela `animes` existe
- [ ] Arquivo `.env` configurado com senha correta
- [ ] `npm install` executado com sucesso
- [ ] Servidor iniciado (`npm start`)
- [ ] http://localhost:3000/api/health retorna success
- [ ] Frontend mostra "🟢 Conectado"

---

**Mantenha este guia à mão para referência rápida!** 📌
