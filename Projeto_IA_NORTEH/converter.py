import base64
import os

# 1. Abre o HTML unificado original
with open('index.html', 'r', encoding='utf-8') as arquivo:
    html = arquivo.read()

# 2. Mapeia as imagens usadas no projeto e seus respectivos formatos
imagens = {
    'img/icon-ia.png': 'image/png',
    'img/logo-ianorth.png': 'image/png',
    'img/fig-02-balanca.gif': 'image/gif',
    'img/fig-03-galpao.gif': 'image/gif'
}

# 3. Processa cada arquivo de imagem
for caminho, mime_type in imagens.items():
    if os.path.exists(caminho):
        with open(caminho, 'rb') as img:
            # Lê os bytes e converte para o formato de texto Base64
            b64_texto = base64.b64encode(img.read()).decode('utf-8')
            
            # Monta a URI completa que o navegador de internet entende
            data_uri = f"data:{mime_type};base64,{b64_texto}"
            
            # Substitui as ocorrências do caminho local pelo texto Base64 no HTML
            html = html.replace(caminho, data_uri)
    else:
        print(f"Aviso: Arquivo {caminho} não encontrado.")

# 4. Salva o resultado em um novo arquivo, pronto para enviar!
with open('prototipo_cubage.html', 'w', encoding='utf-8') as arquivo:
    arquivo.write(html)

print("Sucesso! O arquivo 'prototipo_whatsapp.html' foi gerado com as imagens embutidas.")
