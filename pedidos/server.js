const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir arquivos estáticos
app.use(express.static('public'));

// Lista de pedidos ativos
let pedidos = [];
let pedidoId = 1;

// Gerenciar conexões WebSocket
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Novo cliente conectado');

  // Enviar pedidos existentes para novos clientes
  ws.send(JSON.stringify({ type: 'init', pedidos }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'novo_pedido') {
        const novoPedido = {
          id: pedidoId++,
          itens: data.itens,
          timestamp: new Date().toISOString()
        };
        pedidos.push(novoPedido);

        // Broadcast para todos os clientes conectados
        const msg = JSON.stringify({ type: 'novo_pedido', pedido: novoPedido });
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
          }
        });
      } else if (data.type === 'concluir_pedido') {
        pedidos = pedidos.filter(p => p.id !== data.id);

        // Broadcast atualização
        const msg = JSON.stringify({ type: 'pedido_concluido', id: data.id });
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
          }
        });
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Cliente desconectado');
  });
});

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tablet', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tablet.html'));
});

app.get('/painel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'painel.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Tablet: http://localhost:${PORT}/tablet`);
  console.log(`Painel: http://localhost:${PORT}/painel`);
});
