import base64
import os
import re

caminho_base = '/run/media/rayblade/TH FILMES/Projeto_IA_NORTEH/'
os.chdir(caminho_base)

# Lê o HTML
with open('index.html', 'r', encoding='utf-8') as arquivo:
    html = arquivo.read()

# Encontra automaticamente todas as imagens locais no HTML
padrao = r'src=["\']([^"\']+\.(png|jpg|jpeg|gif|svg|webp))["\']'
imagens_encontradas = re.findall(padrao, html, re.IGNORECASE)

# Mapeia extensão para MIME type
mime_types = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp'
}

# Processa cada imagem encontrada
for caminho, extensao in imagens_encontradas:
    if not caminho.startswith(('http://', 'https://', 'data:')):
        caminho_completo = os.path.join(caminho_base, caminho)
        
        if os.path.exists(caminho_completo):
            with open(caminho_completo, 'rb') as img:
                b64_texto = base64.b64encode(img.read()).decode('utf-8')
                mime = mime_types.get(extensao.lower(), f'image/{extensao}')
                data_uri = f"data:{mime};base64,{b64_texto}"
                html = html.replace(caminho, data_uri)
                print(f"✓ Embutido: {caminho}")
        else:
            print(f"✗ Não encontrado: {caminho}")

# Salva o resultado
with open('brand-design-ianorth.html', 'w', encoding='utf-8') as arquivo:
    arquivo.write(html)

print(f"\n✅ Completo! Arquivo salvo como: brand-design-ianorth.html")