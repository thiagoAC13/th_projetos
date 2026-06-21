# -*- coding: utf-8 -*-
"""
Aplicação Web para Conversão de MP3 em Texto
Autor: Sistema de Transcrição Automática
Descrição: Converte arquivos de áudio MP3 em texto usando IA
"""

# Importação das bibliotecas necessárias
from flask import Flask, render_template, request, jsonify
import whisper
import os
from werkzeug.utils import secure_filename
import tempfile

# Inicialização da aplicação Flask
app = Flask(__name__)

# Configurações da aplicação
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # Limite de 100MB por arquivo
app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()  # Pasta temporária para uploads

# Extensões de arquivo permitidas
EXTENSOES_PERMITIDAS = {'mp3', 'wav', 'm4a', 'ogg'}

# Carregamento do modelo Whisper (apenas uma vez quando o servidor inicia)
# Usando o modelo 'base' que é um bom equilíbrio entre velocidade e precisão
print("Carregando modelo de IA... Isso pode levar alguns segundos na primeira vez.")
modelo = whisper.load_model("base")
print("Modelo carregado com sucesso!")


def arquivo_permitido(nome_arquivo):
    """
    Verifica se o arquivo tem uma extensão permitida
    
    Args:
        nome_arquivo (str): Nome do arquivo a ser verificado
    
    Returns:
        bool: True se a extensão for permitida, False caso contrário
    """
    return '.' in nome_arquivo and \
           nome_arquivo.rsplit('.', 1)[1].lower() in EXTENSOES_PERMITIDAS


@app.route('/')
def index():
    """
    Rota principal que exibe a página inicial
    
    Returns:
        HTML: Renderiza o template index.html
    """
    return render_template('index.html')


@app.route('/transcrever', methods=['POST'])
def transcrever_audio():
    """
    Rota que processa o arquivo de áudio e retorna a transcrição
    
    Returns:
        JSON: Contém a transcrição ou mensagem de erro
    """
    try:
        # Verificar se um arquivo foi enviado
        if 'arquivo' not in request.files:
            return jsonify({
                'sucesso': False,
                'erro': 'Nenhum arquivo foi enviado. Por favor, selecione um arquivo MP3.'
            }), 400
        
        arquivo = request.files['arquivo']
        
        # Verificar se o arquivo tem um nome
        if arquivo.filename == '':
            return jsonify({
                'sucesso': False,
                'erro': 'Nenhum arquivo foi selecionado. Por favor, escolha um arquivo.'
            }), 400
        
        # Verificar se a extensão do arquivo é permitida
        if not arquivo_permitido(arquivo.filename):
            return jsonify({
                'sucesso': False,
                'erro': f'Formato de arquivo não suportado. Use apenas: {", ".join(EXTENSOES_PERMITIDAS)}'
            }), 400
        
        # Salvar o arquivo temporariamente com nome seguro
        nome_seguro = secure_filename(arquivo.filename)
        caminho_temporario = os.path.join(app.config['UPLOAD_FOLDER'], nome_seguro)
        arquivo.save(caminho_temporario)
        
        print(f"Processando arquivo: {nome_seguro}")
        
        # Realizar a transcrição usando o modelo Whisper
        # O parâmetro 'language' pode ser definido como 'pt' para forçar português
        # ou deixar None para detecção automática
        resultado = modelo.transcribe(
            caminho_temporario,
            language='pt',  # Força a transcrição em português
            fp16=False  # Desabilita precisão de 16 bits para compatibilidade
        )
        
        # Extrair o texto transcrito
        texto_transcrito = resultado['text']
        
        # Remover o arquivo temporário após o processamento
        os.remove(caminho_temporario)
        
        print("Transcrição concluída com sucesso!")
        
        # Retornar a resposta em formato JSON
        return jsonify({
            'sucesso': True,
            'transcricao': texto_transcrito,
            'idioma_detectado': resultado.get('language', 'pt')
        })
    
    except Exception as e:
        # Tratamento de erros genéricos
        print(f"Erro durante a transcrição: {str(e)}")
        
        # Tentar remover arquivo temporário em caso de erro
        try:
            if 'caminho_temporario' in locals():
                os.remove(caminho_temporario)
        except:
            pass
        
        return jsonify({
            'sucesso': False,
            'erro': f'Erro ao processar o arquivo: {str(e)}'
        }), 500


@app.route('/status')
def status():
    """
    Rota para verificar se o servidor está funcionando
    
    Returns:
        JSON: Status do servidor
    """
    return jsonify({
        'status': 'online',
        'modelo': 'whisper-base',
        'formatos_suportados': list(EXTENSOES_PERMITIDAS)
    })


# Ponto de entrada da aplicação
if __name__ == '__main__':
    # Criar pasta de templates se não existir
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    print("\n" + "="*50)
    print("SERVIDOR DE TRANSCRIÇÃO DE ÁUDIO")
    print("="*50)
    print("\nPara usar a aplicação:")
    print("1. Abra seu navegador")
    print("2. Acesse: http://localhost:5000")
    print("3. Faça upload de um arquivo MP3")
    print("\nPressione CTRL+C para parar o servidor")
    print("="*50 + "\n")
    
    # Iniciar o servidor Flask
    # debug=True permite ver erros detalhados (desabilite em produção)
    app.run(debug=True, host='0.0.0.0', port=5000)
