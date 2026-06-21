# Di Med — Gerador de Documentos Timbrados

Aplicação web que sobrepõe o conteúdo de qualquer PDF de resultado sobre o papel timbrado da clínica Di Med, centralizando o conteúdo dentro das margens e gerando um arquivo pronto para impressão.

---

## Requisitos

- Python 3.10 ou superior
- pip

---

## Setup (primeira vez)

```bash
# 1. Entre na pasta do projeto
cd dimed_app

# 2. Crie e ative um ambiente virtual (recomendado)
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
.venv\Scripts\activate           # Windows

# 3. Instale as dependências
pip install -r requirements.txt
```

---

## Executar

```bash
python app.py
```

Abra o navegador em: **http://localhost:5000**

---

## Como usar

1. **Papel Timbrado** — faça upload do PDF `PAPEL TIMBRADO FONO ASS DIGITAL DIMED.pdf` (ou qualquer papel timbrado futuro).
2. **Documento de Resultado** — faça upload do PDF do exame/laudo.
3. Clique em **Gerar Documento Timbrado**.
4. O download do PDF final começa automaticamente.

---

## Ajuste de margens (avançado)

Clique em **⚙️ Configurações de margem** na interface para ajustar as margens em pontos (1 pt = 1/72 polegada):

| Margem | Padrão | Finalidade |
|--------|--------|-----------|
| Esquerda | 72 pt (1") | Banda verde vertical do timbrado |
| Direita | 36 pt | Borda direita |
| Superior | 90 pt | Área do logo/cabeçalho |
| Inferior | 72 pt | Banda de rodapé + endereço |

---

## Estrutura do projeto

```
dimed_app/
├── app.py              # Servidor Flask (rotas, upload, download)
├── pdf_processor.py    # Lógica de sobreposição de PDFs
├── requirements.txt
├── templates/
│   └── index.html      # Interface web
├── static/
│   ├── css/style.css
│   └── js/app.js
├── uploads/            # Arquivos temporários (auto-limpos após processamento)
└── outputs/            # PDFs gerados (podem ser apagados periodicamente)
```

---

## Limites

- Tamanho máximo por arquivo: **50 MB**
- Formatos aceitos: **PDF apenas**
- O papel timbrado é ciclado se o documento tiver mais páginas que o timbrado

---

## Produção

Para uso em produção, substitua o servidor de desenvolvimento do Flask por **Gunicorn**:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```
