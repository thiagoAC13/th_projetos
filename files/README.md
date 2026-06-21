# 🦷 Sistema de Pedidos - Clínica Odontológica

Sistema web em tempo real para gerenciar pedidos de bebidas e lanches na sala de espera da clínica odontológica.

## 📋 Funcionalidades

- **Interface do Tablet**: Interface amigável para clientes selecionarem itens (café, chá, suco, água, biscoitos e bolo)
- **Painel Administrativo**: Recebe pedidos em tempo real com notificações sonoras e visuais
- **Sincronização Instantânea**: Comunicação via WebSocket para atualizações em tempo real
- **Responsivo**: Funciona perfeitamente em tablets, PCs e dispositivos móveis
- **Notificações**: Alertas sonoros e visuais quando novos pedidos chegam
- **Gestão Simples**: Marcar pedidos como prontos com um clique

## 🚀 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM (geralmente vem com Node.js)

### Passos de Instalação

1. **Instalar as dependências:**

```bash
npm install
```

2. **Iniciar o servidor:**

```bash
npm start
```

3. **Acessar o sistema:**

O servidor estará rodando em `http://localhost:3000`

## 📱 Como Usar

### Configuração Inicial

1. **No PC (computador da equipe):**
   - Abra o navegador e acesse: `http://localhost:3000/painel`
   - Esta é a interface administrativa onde você receberá os pedidos
   - Deixe esta janela aberta durante o expediente

2. **No Tablet (sala de espera):**
   - Abra o navegador e acesse: `http://localhost:3000/tablet`
   - Esta é a interface que os clientes usarão para fazer pedidos
   - Posicione o tablet em local visível e acessível na sala de espera

### Rede Local (Importante!)

Para que o tablet e o PC se comuniquem, ambos precisam estar **na mesma rede WiFi**.

#### Descobrir o IP do PC:

**Windows:**
```bash
ipconfig
```
Procure por "Endereço IPv4" (exemplo: 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```
Procure pelo endereço IP da sua rede local

#### Acessar de outros dispositivos:

Em vez de `localhost`, use o IP do PC:
- Tablet: `http://192.168.1.100:3000/tablet`
- Outro PC: `http://192.168.1.100:3000/painel`

### Fluxo de Uso

1. **Cliente na sala de espera:**
   - Acessa o tablet
   - Seleciona os itens desejados (os botões ficam destacados)
   - Clica em "Enviar Pedido"
   - Recebe confirmação visual

2. **Você no PC:**
   - Recebe notificação sonora e visual
   - Vê o pedido aparecer na lista com os itens solicitados
   - Prepara os itens
   - Leva para o cliente
   - Clica em "Marcar como Pronto" para remover da lista

## 🎨 Interfaces

### Interface do Tablet
- Design colorido e amigável
- Botões grandes com ícones visuais
- Feedback imediato ao enviar pedido
- Animações suaves

### Painel Administrativo
- Interface profissional escura
- Estatísticas em tempo real
- Lista clara de pedidos pendentes
- Notificações destacadas

## ⚙️ Itens Disponíveis

- ☕ Café
- 🍵 Chá
- 🧃 Suco
- 💧 Água
- 🍪 Biscoito Doce
- 🥨 Biscoito Salgado
- 🍰 Bolo

## 🔧 Estrutura de Arquivos

```
sistema-pedidos-clinica/
├── server.js           # Servidor Node.js com WebSocket
├── package.json        # Dependências do projeto
├── public/
│   ├── index.html     # Página inicial com links
│   ├── tablet.html    # Interface do tablet (clientes)
│   └── painel.html    # Painel administrativo (equipe)
└── README.md          # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **WebSocket**: ws (comunicação em tempo real)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Design**: Fonts do Google Fonts

## 📊 Recursos do Painel

- Contador de pedidos ativos
- Total de itens solicitados
- Total de pedidos concluídos no dia
- Status de conexão em tempo real
- Notificações sonoras customizadas

## 🔐 Segurança e Privacidade

- Sistema funciona apenas na rede local
- Não armazena dados pessoais dos clientes
- Pedidos são temporários (não há histórico permanente)
- Conexão segura via WebSocket

## 💡 Dicas de Uso

1. **Posicionamento do Tablet**: Coloque em suporte fixo com altura confortável para todos os clientes
2. **Manutenção da Conexão**: Mantenha ambos os dispositivos conectados à mesma rede WiFi
3. **Teste Regular**: Faça um pedido teste no início do dia para garantir que tudo está funcionando
4. **Atualização Visual**: O painel atualiza automaticamente, não é necessário recarregar a página

## 🐛 Solução de Problemas

### O tablet não envia pedidos:
- Verifique se está conectado à mesma rede WiFi
- Recarregue a página do tablet
- Confirme que o servidor está rodando

### O painel não recebe pedidos:
- Verifique o status de conexão (deve mostrar "Conectado")
- Recarregue a página do painel
- Verifique se o servidor está ativo

### Servidor não inicia:
- Confirme que as dependências foram instaladas (`npm install`)
- Verifique se a porta 3000 não está sendo usada por outro aplicativo

## 📞 Suporte

Para melhorias ou personalizações, você pode:
- Modificar os itens no código
- Ajustar cores e estilos no CSS
- Adicionar novos recursos conforme necessário

## 📝 Licença

Este projeto é de uso livre para fins comerciais e pessoais.

---

**Desenvolvido para otimizar a experiência dos clientes em clínicas odontológicas** 🦷✨
