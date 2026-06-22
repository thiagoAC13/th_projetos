# Manual do Sistema PDV - Mini Mercado

## Requisitos do Computador

### Mínimos
- **Sistema Operacional:** Windows 10, macOS 10.14, ou Linux (Ubuntu 18.04+)
- **Processador:** Intel Core i3 ou equivalente
- **Memória RAM:** 4 GB
- **Armazenamento:** 500 MB livres
- **Navegador:** Google Chrome 90+, Firefox 88+, Microsoft Edge 90+, ou Safari 14+
- **Tela:** Resolução mínima de 1366x768 pixels

### Recomendados
- **Processador:** Intel Core i5 ou superior
- **Memória RAM:** 8 GB
- **Tela:** 1920x1080 pixels ou superior
- **Leitor de código de barras USB** (opcional, mas facilita muito)

> **Importante:** O sistema funciona 100% offline após o primeiro acesso. Não precisa de internet para operar no dia a dia.

---

## Instalação

### Opção 1: Acesso Online (Mais Fácil)
1. Abra o navegador (recomendamos Google Chrome)
2. Acesse o endereço do sistema fornecido
3. Pronto! O sistema já está funcionando

### Opção 2: Instalação Local
1. Baixe o código do sistema (arquivo ZIP)
2. Extraia a pasta em um local de sua preferência
3. Abra o terminal/prompt de comando na pasta extraída
4. Execute os comandos:
   ```
   npm install
   npm run build
   npm start
   ```
5. Acesse `http://localhost:3000` no navegador

### Opção 3: Instalar como Aplicativo (PWA)
1. Acesse o sistema pelo navegador Chrome
2. Clique no ícone de "Instalar" na barra de endereços (ou menu > Instalar)
3. O sistema será instalado como um aplicativo no computador
4. Pode ser aberto pelo menu Iniciar/Aplicativos

---

## Como Usar o Sistema

### 1. Primeiro Acesso - Cadastrar Produtos

Antes de começar a vender, cadastre seus produtos:

1. Clique na aba **"Produtos"** no menu superior
2. Clique no botão **"Novo Produto"**
3. Preencha os dados:
   - **Nome:** Nome do produto (ex: "Arroz Tio João 5kg")
   - **Código de Barras:** Escaneie ou digite o código EAN do produto
   - **Preço de Custo:** Quanto você pagou no produto
   - **Preço de Venda:** Quanto vai vender
   - **Estoque Atual:** Quantidade disponível
   - **Estoque Mínimo:** Quantidade para alertar reposição
4. Clique em **"Salvar"**

> **Dica:** Você pode usar o leitor de código de barras para preencher automaticamente o campo de código.

---

### 2. Abrir o Caixa

Antes de começar a vender no dia:

1. Clique na aba **"Caixa"** no menu superior
2. Digite o valor do **fundo de caixa** (dinheiro inicial no caixa)
3. Clique em **"Abrir Caixa"**

> O caixa precisa estar aberto para realizar vendas.

---

### 3. Realizar uma Venda

1. Clique na aba **"PDV"** (Ponto de Venda)
2. **Adicionar produtos:**
   - **Com leitor:** Escaneie o código de barras do produto
   - **Sem leitor:** Digite o código ou nome do produto e pressione Enter
3. **Para quantidades maiores:**
   - Digite a quantidade seguida de asterisco, depois o código
   - Exemplo: `5*7891234567890` adiciona 5 unidades
4. **Finalizar a venda:**
   - Pressione **F2** ou clique em **"Pagamento (F2)"**
   - Selecione a forma de pagamento (Dinheiro, Cartão ou Pix)
   - Se for dinheiro, digite o valor recebido para calcular o troco
   - Clique em **"Finalizar Venda"**

#### Atalhos do Teclado no PDV
| Tecla | Função |
|-------|--------|
| **Enter** | Adicionar produto |
| **F2** | Abrir pagamento |
| **F3** | Buscar produto |
| **ESC** | Limpar venda atual |

---

### 4. Fechar o Caixa

Ao final do expediente:

1. Vá para a aba **"Caixa"**
2. Confira o resumo de vendas e o saldo esperado
3. Clique em **"Fechar Caixa"**
4. O sistema mostrará um resumo do dia

---

### 5. Ver Relatórios

Para acompanhar as vendas:

1. Clique na aba **"Relatórios"**
2. Selecione o período desejado (Hoje, 7 dias, Mês, Tudo)
3. Veja:
   - **Receita total** do período
   - **Lucro bruto** e margem de lucro
   - **Produtos mais vendidos**
   - **Vendas por hora** (útil para entender horários de pico)
   - **Histórico completo** de todas as vendas

---

### 6. Repor Estoque

Quando chegar mercadoria nova:

1. Vá para a aba **"Produtos"**
2. Encontre o produto na lista
3. Clique no botão **"+ Entrada"** (ícone de seta para baixo)
4. Digite a quantidade recebida
5. Clique em **"Adicionar"**

> Produtos com estoque baixo aparecem destacados em vermelho.

---

## Dicas Importantes

### Backup dos Dados
O sistema armazena os dados no navegador (IndexedDB). Para não perder dados:
- **Não limpe os dados de navegação** do navegador usado
- **Não use navegação anônima/privada**
- **Faça backup regularmente** exportando os relatórios

### Leitor de Código de Barras
- A maioria dos leitores USB funciona como um "teclado"
- Basta conectar na porta USB e usar normalmente
- Configure o leitor para adicionar "Enter" após a leitura

### Se o Sistema Travar
1. Atualize a página (F5)
2. Se persistir, feche e abra o navegador
3. Em último caso, limpe o cache (mas isso apaga os dados!)

---

## Resolução de Problemas

| Problema | Solução |
|----------|---------|
| Produto não encontrado | Verifique se o código está cadastrado corretamente |
| Não consigo vender | Verifique se o caixa está aberto |
| Leitor não funciona | Verifique a conexão USB e teste em um editor de texto |
| Sistema lento | Feche outras abas e programas |
| Dados sumiram | Alguém pode ter limpado os dados do navegador |

---

## Suporte

Para dúvidas ou problemas:
- Consulte este manual
- Verifique se o navegador está atualizado
- Reinicie o computador se necessário

---

*Sistema desenvolvido para facilitar a gestão do seu mini mercado. Boas vendas!*
