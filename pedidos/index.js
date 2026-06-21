const express = require('express');
const app = express();
const port = 3000;

// Rota principal (Página Inicial)
app.get('/', (req, res) => {
  res.send('<h1>Servidor Online!</h1><p>A rota principal está funcionando.</p>');
});

// Uma rota de teste (ex: http://localhost:3000/api)
app.get('/api', (req, res) => {
  res.json({ status: 'sucesso', mensagem: 'API respondendo corretamente' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
