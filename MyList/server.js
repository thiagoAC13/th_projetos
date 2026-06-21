const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(bodyParser.json({ limit: '50mb' })); // Aumentado para suportar imagens Base64
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROTAS DA API
// ============================================

// 1. GET /api/animes - Listar todos os animes
app.get('/api/animes', async (req, res) => {
  try {
    const { status, favorite, search, sortBy } = req.query;
    
    let query = 'SELECT * FROM animes WHERE 1=1';
    const params = [];
    let paramCount = 1;

    // Filtro por status
    if (status && status !== 'all') {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    // Filtro por favoritos
    if (favorite === 'true') {
      query += ` AND favorite = true`;
    }

    // Busca por nome
    if (search) {
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Ordenação
    if (sortBy === 'favorites') {
      query += ' ORDER BY favorite DESC, added_at DESC';
    } else if (sortBy === 'name') {
      query += ' ORDER BY name ASC';
    } else {
      query += ' ORDER BY added_at DESC'; // Padrão: mais recentes
    }

    const result = await db.query(query, params);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Erro ao buscar animes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar animes',
      error: error.message
    });
  }
});

// 2. GET /api/animes/:id - Buscar anime específico
app.get('/api/animes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM animes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anime não encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar anime:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar anime',
      error: error.message
    });
  }
});

// 3. POST /api/animes - Criar novo anime
app.post('/api/animes', async (req, res) => {
  try {
    const { name, image, status, favorite } = req.body;

    // Validação
    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: 'Nome e imagem são obrigatórios'
      });
    }

    if (!['acompanhando', 'visto', 'futuro'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    const query = `
      INSERT INTO animes (name, image, status, favorite)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      name,
      image,
      status || 'acompanhando',
      favorite || false
    ]);

    res.status(201).json({
      success: true,
      message: 'Anime criado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar anime:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar anime',
      error: error.message
    });
  }
});

// 4. PUT /api/animes/:id - Atualizar anime
app.put('/api/animes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, status, favorite } = req.body;

    // Verificar se anime existe
    const checkResult = await db.query('SELECT * FROM animes WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anime não encontrado'
      });
    }

    // Validação de status
    if (status && !['acompanhando', 'visto', 'futuro'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    const query = `
      UPDATE animes
      SET name = COALESCE($1, name),
          image = COALESCE($2, image),
          status = COALESCE($3, status),
          favorite = COALESCE($4, favorite),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;

    const result = await db.query(query, [name, image, status, favorite, id]);

    res.json({
      success: true,
      message: 'Anime atualizado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar anime:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar anime',
      error: error.message
    });
  }
});

// 5. PATCH /api/animes/:id/favorite - Alternar favorito
app.patch('/api/animes/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      UPDATE animes
      SET favorite = NOT favorite,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anime não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Favorito atualizado',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar favorito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar favorito',
      error: error.message
    });
  }
});

// 6. PATCH /api/animes/:id/status - Mudar status
app.patch('/api/animes/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['acompanhando', 'visto', 'futuro'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    const query = `
      UPDATE animes
      SET status = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await db.query(query, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anime não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Status atualizado',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status',
      error: error.message
    });
  }
});

// 7. DELETE /api/animes/:id - Deletar anime
app.delete('/api/animes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM animes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anime não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Anime deletado com sucesso',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao deletar anime:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar anime',
      error: error.message
    });
  }
});

// 8. GET /api/stats - Estatísticas
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'acompanhando') as acompanhando,
        COUNT(*) FILTER (WHERE status = 'visto') as visto,
        COUNT(*) FILTER (WHERE status = 'futuro') as futuro,
        COUNT(*) FILTER (WHERE favorite = true) as favoritos
      FROM animes
    `);

    res.json({
      success: true,
      data: stats.rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    });
  }
});

// Rota de health check
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      success: true,
      message: 'API funcionando',
      database: 'conectado',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro na API',
      database: 'desconectado',
      error: error.message
    });
  }
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({
    message: 'API do Gerenciador de Animes',
    version: '1.0.0',
    endpoints: {
      animes: '/api/animes',
      health: '/api/health',
      stats: '/api/stats'
    }
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║  🎌 Anime Manager API                  ║
  ║  ✅ Servidor rodando na porta ${PORT}     ║
  ║  🌐 http://localhost:${PORT}              ║
  ║  📚 Documentação: /api/health          ║
  ╚════════════════════════════════════════╝
  `);
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  db.pool.end(() => {
    console.log('Pool de conexões encerrado');
    process.exit(0);
  });
});
