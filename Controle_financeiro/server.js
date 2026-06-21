// server.js - Backend com Node.js + Express + SQLite
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Para servir o HTML

// Conectar/criar banco de dados SQLite
const db = new sqlite3.Database('./financeiro.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite');
        initDatabase();
    }
});

// Criar tabela se não existir
function initDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL,
            descricao TEXT NOT NULL,
            categoria TEXT NOT NULL,
            valor REAL NOT NULL,
            tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa', 'investimento')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err);
        } else {
            console.log('✅ Tabela transactions pronta');
        }
    });
}

// ==================== ROTAS DA API ====================

// 1. Buscar todas as transações
app.get('/api/transactions', (req, res) => {
    db.all('SELECT * FROM transactions ORDER BY data ASC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 2. Buscar transação por ID
app.get('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Transação não encontrada' });
            return;
        }
        res.json(row);
    });
});

// 3. Criar nova transação
app.post('/api/transactions', (req, res) => {
    const { data, descricao, categoria, valor, tipo } = req.body;
    
    // Validação
    if (!data || !descricao || !categoria || !valor || !tipo) {
        res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        return;
    }
    
    if (!['receita', 'despesa', 'investimento'].includes(tipo)) {
        res.status(400).json({ error: 'Tipo deve ser "receita", "despesa" ou "investimento"' });
        return;
    }

    const sql = `INSERT INTO transactions (data, descricao, categoria, valor, tipo) 
                 VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [data, descricao, categoria, valor, tipo], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            id: this.lastID,
            message: 'Transação criada com sucesso'
        });
    });
});

// 4. Atualizar transação
app.put('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const { data, descricao, categoria, valor, tipo } = req.body;
    
    const sql = `UPDATE transactions 
                 SET data = ?, descricao = ?, categoria = ?, valor = ?, tipo = ?
                 WHERE id = ?`;
    
    db.run(sql, [data, descricao, categoria, valor, tipo, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Transação não encontrada' });
            return;
        }
        res.json({ message: 'Transação atualizada com sucesso' });
    });
});

// 5. Deletar transação
app.delete('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM transactions WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Transação não encontrada' });
            return;
        }
        res.json({ message: 'Transação deletada com sucesso' });
    });
});

// 6. Deletar todas as transações
app.delete('/api/transactions', (req, res) => {
    db.run('DELETE FROM transactions', [], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ 
            message: 'Todas as transações foram deletadas',
            deletedCount: this.changes
        });
    });
});

// 7. Obter resumo (totais)
app.get('/api/summary', (req, res) => {
    const sql = `
        SELECT 
            SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) as total_receitas,
            SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as total_despesas,
            SUM(CASE WHEN tipo = 'investimento' THEN valor ELSE 0 END) as total_investimentos,
            SUM(CASE WHEN tipo = 'receita' THEN valor 
                     WHEN tipo = 'despesa' THEN -valor 
                     ELSE 0 END) as saldo
        FROM transactions
    `;
    
    db.get(sql, [], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            totalReceitas: row.total_receitas || 0,
            totalDespesas: row.total_despesas || 0,
            totalInvestimentos: row.total_investimentos || 0,
            saldo: row.saldo || 0
        });
    });
});

// Rota inicial
app.get('/', (req, res) => {
    res.send(`
        <h1>API Controle Financeiro</h1>
        <p>Backend rodando com sucesso! ✅</p>
        <h3>Endpoints disponíveis:</h3>
        <ul>
            <li>GET /api/transactions - Listar todas</li>
            <li>GET /api/transactions/:id - Buscar por ID</li>
            <li>POST /api/transactions - Criar nova</li>
            <li>PUT /api/transactions/:id - Atualizar</li>
            <li>DELETE /api/transactions/:id - Deletar</li>
            <li>DELETE /api/transactions - Deletar todas</li>
            <li>GET /api/summary - Resumo financeiro</li>
        </ul>
    `);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 API disponível em http://localhost:${PORT}/api/transactions`);
});

// Fechar banco ao encerrar
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Banco de dados fechado');
        process.exit(0);
    });
});
