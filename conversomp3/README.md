# 🎵 Conversor de Áudio para Texto

Uma aplicação web simples e intuitiva que converte arquivos de áudio (MP3, WAV, M4A, OGG) em texto usando Inteligência Artificial.

## 📋 O que esta aplicação faz?

- ✅ Converte arquivos de áudio em texto automaticamente
- ✅ Suporta múltiplos formatos: MP3, WAV, M4A, OGG
- ✅ Interface web bonita e fácil de usar
- ✅ Funciona 100% localmente (sem enviar dados para servidores externos)
- ✅ Não precisa de chaves de API ou cadastros
- ✅ Totalmente GRATUITO

---

## 🚀 Instalação Passo a Passo

### Passo 1: Instalar Python

Você precisa ter Python instalado no seu computador.

**Verificar se já tem Python:**
```bash
python --version
```

Se não tiver, baixe e instale:
- **Windows/Mac**: https://www.python.org/downloads/ (versão 3.8 ou superior)
- **Linux**: Geralmente já vem instalado

### Passo 2: Instalar FFmpeg

O FFmpeg é necessário para processar arquivos de áudio.

**Windows:**
1. Baixe o FFmpeg de: https://ffmpeg.org/download.html
2. Extraia o arquivo ZIP
3. Adicione a pasta `bin` ao PATH do Windows
   - Tutorial: https://www.wikihow.com/Install-FFmpeg-on-Windows

**macOS:**
```bash
brew install ffmpeg
```
(Se não tiver o Homebrew, instale em: https://brew.sh/)

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Verificar se o FFmpeg está instalado:**
```bash
ffmpeg -version
```

### Passo 3: Baixar os Arquivos do Projeto

1. Crie uma pasta no seu computador (exemplo: `conversor-audio`)
2. Coloque todos os arquivos do projeto nesta pasta:
   - `app.py`
   - `requirements.txt`
   - Pasta `templates` (contendo `index.html`)

A estrutura deve ficar assim:
```
conversor-audio/
├── app.py
├── requirements.txt
├── templates/
│   └── index.html
└── README.md (este arquivo)
```

### Passo 4: Instalar as Dependências Python

Abra o terminal/prompt de comando na pasta do projeto e execute:

**Windows:**
```bash
cd C:\caminho\para\conversor-audio
pip install -r requirements.txt
```

**Mac/Linux:**
```bash
cd /caminho/para/conversor-audio
pip install -r requirements.txt
```

⏰ **IMPORTANTE:** A instalação pode levar de 5 a 15 minutos, pois vai baixar o modelo de IA (cerca de 1-2 GB). Seja paciente!

---

## ▶️ Como Executar a Aplicação

### Passo 1: Iniciar o Servidor

No terminal, dentro da pasta do projeto, execute:

```bash
python app.py
```

Você verá uma mensagem parecida com esta:
```
==================================================
SERVIDOR DE TRANSCRIÇÃO DE ÁUDIO
==================================================

Para usar a aplicação:
1. Abra seu navegador
2. Acesse: http://localhost:5000
3. Faça upload de um arquivo MP3

Pressione CTRL+C para parar o servidor
==================================================

* Running on http://0.0.0.0:5000
```

### Passo 2: Abrir no Navegador

1. Abra seu navegador (Chrome, Firefox, Edge, Safari)
2. Digite na barra de endereços: `http://localhost:5000`
3. Pressione Enter

### Passo 3: Usar a Aplicação

1. **Selecionar arquivo:** Clique na área de upload ou arraste um arquivo MP3
2. **Converter:** Clique no botão "Converter em Texto"
3. **Aguardar:** O processamento pode levar alguns minutos dependendo do tamanho do arquivo
4. **Ver resultado:** O texto aparecerá na tela
5. **Copiar:** Use o botão "Copiar Texto" para copiar a transcrição

---

## 🧪 Testando a Aplicação

### Teste Básico

1. Grave um áudio curto (10-30 segundos) no seu celular
2. Transfira para o computador
3. Faça upload na aplicação
4. Verifique se o texto está correto

### Teste com Arquivo de Exemplo

Se você não tiver um arquivo MP3, pode usar sites gratuitos de conversão de texto para áudio:
- https://ttsmp3.com/
- https://www.naturalreaders.com/online/

1. Digite uma frase em português
2. Baixe o arquivo MP3 gerado
3. Teste na aplicação

---

## ❓ Perguntas Frequentes

### 1. A aplicação é gratuita?
**Sim!** Totalmente gratuita e sem limites de uso.

### 2. Preciso de internet?
**Não!** Após a instalação, tudo funciona offline. A primeira execução pode baixar o modelo de IA (requer internet apenas uma vez).

### 3. Meus áudios são enviados para algum servidor?
**Não!** Tudo é processado localmente no seu computador. Seus dados ficam 100% privados.

### 4. Quanto tempo leva para transcrever?
Depende do tamanho do arquivo e do seu computador:
- 1 minuto de áudio = 30 segundos a 2 minutos de processamento

### 5. Quais idiomas são suportados?
O código está configurado para português, mas o Whisper suporta mais de 50 idiomas.

### 6. Posso processar arquivos grandes?
O limite atual é 100MB. Arquivos maiores podem demorar muito ou travar.

---

## 🛠️ Solução de Problemas

### Erro: "ModuleNotFoundError: No module named 'flask'"
**Solução:** Execute `pip install -r requirements.txt` novamente

### Erro: "ffmpeg not found"
**Solução:** Instale o FFmpeg conforme instruções do Passo 2

### Erro: "Address already in use"
**Solução:** Outra aplicação está usando a porta 5000. No arquivo `app.py`, linha final, troque `port=5000` para `port=5001`

### A página não carrega no navegador
**Solução:** 
1. Verifique se o servidor está rodando no terminal
2. Tente acessar: `http://127.0.0.1:5000`
3. Verifique se o firewall não está bloqueando

### Transcrição está em branco
**Solução:**
1. Verifique se o arquivo de áudio tem voz clara
2. Tente com um arquivo diferente
3. Verifique se o áudio não está corrompido

---

## 🔧 Personalização

### Mudar o Idioma da Transcrição

No arquivo `app.py`, linha 91, você pode mudar o idioma:

```python
resultado = modelo.transcribe(
    caminho_temporario,
    language='pt',  # Mude para: 'en' (inglês), 'es' (espanhol), etc.
    fp16=False
)
```

### Mudar a Qualidade do Modelo

No arquivo `app.py`, linha 26, você pode usar modelos diferentes:

```python
# Modelos disponíveis (do mais rápido/menos preciso ao mais lento/mais preciso):
# "tiny"   - Muito rápido, menos preciso
# "base"   - Equilíbrio (PADRÃO)
# "small"  - Mais preciso, mais lento
# "medium" - Muito preciso, muito lento
# "large"  - Máxima precisão, muito lento

modelo = whisper.load_model("base")  # Mude para outro modelo se desejar
```

---

## 📚 Recursos Adicionais

- **Documentação do Flask:** https://flask.palletsprojects.com/
- **Documentação do Whisper:** https://github.com/openai/whisper
- **Python para Iniciantes:** https://www.python.org/about/gettingstarted/

---

## 💡 Próximos Passos

Depois de dominar esta aplicação, você pode:

1. Adicionar suporte para mais formatos de arquivo
2. Implementar download do texto em arquivo .txt
3. Criar sistema de histórico de transcrições
4. Adicionar tradução automática
5. Implementar identificação de múltiplos falantes

---

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. Leia a seção "Solução de Problemas" acima
2. Verifique se seguiu todos os passos de instalação
3. Procure o erro no Google (copie a mensagem de erro exata)

---

## 📝 Licença

Este projeto é de código aberto e pode ser usado livremente para fins educacionais e pessoais.

---

**Desenvolvido com ❤️ para iniciantes em programação**
