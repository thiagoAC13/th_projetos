import os
import hashlib
import json
import logging
import shutil
import getpass
from datetime import datetime
from collections import defaultdict

def calculate_sha256(file_path):
    """
    Calcula o hash SHA-256 de um arquivo.
    
    Args:
    file_path (str): O caminho completo do arquivo.
    
    Returns:
    str: O hash SHA-256 em formato hexadecimal.
    """
    sha256_hash = hashlib.sha256()
    try:
        with open(file_path, "rb") as f:
            for block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(block)
        return sha256_hash.hexdigest()
    except Exception as e:
        print(f"Erro ao calcular hash para {file_path}: {e}")
        return None  # Retorna None em caso de erro

def generate_baseline(directory):
    """
    Percorre o diretório e gera o arquivo hashes.json com os hashes SHA-256.
    
    Args:
    directory (str): O caminho do diretório a ser escaneado.
    """
    hashes = {}  # Dicionário para armazenar os hashes
    for root, dirs, files in os.walk(directory):
        for file in files:
            full_path = os.path.join(root, file)
            relative_path = os.path.relpath(full_path, directory)  # Caminho relativo ao diretório raiz
            hash_value = calculate_sha256(full_path)
            if hash_value:  # Só adiciona se o hash foi calculado com sucesso
                hashes[relative_path] = hash_value
    
    # Escreve o dicionário no arquivo hashes.json
    with open('hashes.json', 'w') as json_file:
        json.dump(hashes, json_file, indent=4)  # Indentação para legibilidade
    print(f"Baseline gerado com sucesso em hashes.json no diretório atual.")
    
    # Cria backup
    create_backup('hashes.json')

def create_backup(source_file):
    """
    Cria uma cópia de backup do arquivo hashes.json em backups/hashes_YYYYMMDD.json.
    
    Args:
    source_file (str): Arquivo a ser copiado (hashes.json).
    """
    if os.path.exists(source_file):
        backup_dir = 'backups'
        os.makedirs(backup_dir, exist_ok=True)  # Cria a pasta se não existir
        timestamp = datetime.now().strftime('%Y%m%d')
        backup_file = os.path.join(backup_dir, f'hashes_{timestamp}.json')
        shutil.copy(source_file, backup_file)
        print(f"Backup criado: {backup_file}")

def load_baseline(baseline_file='hashes.json'):
    """
    Carrega o baseline do arquivo hashes.json.
    
    Args:
    baseline_file (str): Caminho para o arquivo de baseline.
    
    Returns:
    dict: Dicionário com os hashes do baseline.
    """
    if os.path.exists(baseline_file):
        with open(baseline_file, 'r') as f:
            return json.load(f)
    else:
        return {}

def detect_duplicates(new_hashes):
    """
    Detecta arquivos duplicados (mesmo hash) e registra no log.
    
    Args:
    new_hashes (dict): Dicionário com caminhos relativos e seus hashes.
    """
    # Agrupa arquivos por hash
    hash_to_files = {}
    for file_path, hash_value in new_hashes.items():
        if hash_value not in hash_to_files:
            hash_to_files[hash_value] = []
        hash_to_files[hash_value].append(file_path)
    
    # Registra duplicatas (hashes com mais de um arquivo)
    for hash_value, files in hash_to_files.items():
        if len(files) > 1:
            # Ordena os arquivos para consistência na mensagem
            files_sorted = sorted(files)
            for i in range(len(files_sorted) - 1):
                for j in range(i + 1, len(files_sorted)):
                    logging.info(f"POSSÍVEL DUPLICATA: {files_sorted[i]} e {files_sorted[j]}", extra={'user': getpass.getuser()})

def generate_report(log_file='logs_monitor.log', report_file='relatorio.md'):
    """
    Gera um relatório baseado no log de eventos.
    
    Args:
    log_file (str): Caminho para o arquivo de log.
    report_file (str): Caminho para o arquivo de relatório.
    """
    if not os.path.exists(log_file):
        print(f"Erro: Arquivo de log '{log_file}' não encontrado. Não é possível gerar relatório.")
        return
    
    # Conta os eventos
    event_counts = defaultdict(int)
    file_changes = defaultdict(int)  # Conta alterações por arquivo
    
    with open(log_file, 'r') as f:
        for line in f:
            if ' - ' in line:
                parts = line.split(' - ', 3)  # Divide em data, user, level, message
                if len(parts) >= 4:
                    event = parts[3].strip()
                    if event.startswith('Criação:'):
                        event_counts['Criações'] += 1
                        file_changes[event.split(': ')[1]] += 1
                    elif event.startswith('Alteração:'):
                        event_counts['Alterações'] += 1
                        file_changes[event.split(': ')[1]] += 1
                    elif event.startswith('Exclusão:'):
                        event_counts['Exclusões'] += 1
                        file_changes[event.split(': ')[1]] += 1
                    elif event.startswith('POSSÍVEL DUPLICATA:'):
                        event_counts['Duplicatas'] += 1
    
    # Identifica arquivos com mais alterações
    top_files = sorted(file_changes.items(), key=lambda x: x[1], reverse=True)[:5]  # Top 5
    
    # Gera o relatório em Markdown
    with open(report_file, 'w') as f:
        f.write("# Relatório de Monitoramento de Integridade\n\n")
        f.write(f"**Data de Geração:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write("## Resumo dos Eventos Detectados\n\n")
        f.write(f"- **Criações:** {event_counts['Criações']}\n")
        f.write(f"- **Alterações:** {event_counts['Alterações']}\n")
        f.write(f"- **Exclusões:** {event_counts['Exclusões']}\n")
        f.write(f"- **Duplicatas:** {event_counts['Duplicatas']}\n\n")
        f.write(f"**Totais na Execução:** Criados: {event_counts['Criações']} / Alterados: {event_counts['Alterações']} / Excluídos: {event_counts['Exclusões']}\n\n")
        f.write("## Análise de Risco\n\n")
        if top_files:
            f.write("### Arquivos com Mais Alterações\n")
            for file, count in top_files:
                f.write(f"- **{file}**: {count} alterações\n")
            f.write("\n")
        else:
            f.write("Nenhum arquivo com alterações detectadas.\n\n")
        f.write("### Medidas Recomendadas para Reduzir Incidentes\n")
        f.write("- **Backups Regulares:** Realize backups automáticos para recuperar arquivos excluídos ou alterados.\n")
        f.write("- **Controle de Permissões:** Limite o acesso de escrita aos arquivos críticos para evitar alterações não autorizadas.\n")
        f.write("- **Monitoramento Contínuo:** Use ferramentas como `watchdog` para alertas em tempo real.\n")
        f.write("- **Verificação de Duplicatas:** Remova duplicatas desnecessárias para economizar espaço e reduzir confusões.\n")
        f.write("- **Auditoria de Logs:** Revise os logs periodicamente para identificar padrões suspeitos.\n\n")
        f.write("**Nota:** Este relatório é baseado no log atual. Para análises mais profundas, considere integrar com sistemas de SIEM.\n")
    
    print(f"Relatório gerado com sucesso em {report_file}.")

def detect_changes(directory, baseline_file='hashes.json'):
    """
    Detecta mudanças no diretório comparando com o baseline e registra logs.
    
    Args:
    directory (str): O caminho do diretório a ser escaneado.
    baseline_file (str): Caminho para o arquivo de baseline.
    """
    # Configura o logging com formatter customizado
    class CustomFormatter(logging.Formatter):
        def format(self, record):
            record.user = getattr(record, 'user', 'unknown')
            return super().format(record)
    
    formatter = CustomFormatter('%(asctime)s - user=%(user)s - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    handler = logging.FileHandler('logs_monitor.log')
    handler.setFormatter(formatter)
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.addHandler(handler)
    
    # Carrega o baseline
    baseline = load_baseline(baseline_file)
    if not baseline:
        print("Baseline não encontrado. Gerando novo baseline...")
        generate_baseline(directory)
        return  # Sai se não havia baseline
    
    # Faz um novo scan
    new_hashes = {}
    for root, dirs, files in os.walk(directory):
        for file in files:
            full_path = os.path.join(root, file)
            relative_path = os.path.relpath(full_path, directory)
            hash_value = calculate_sha256(full_path)
            if hash_value:
                new_hashes[relative_path] = hash_value
    
    # Detecta mudanças
    changes_detected = False
    
    # Verifica criações e alterações
    for file_path, new_hash in new_hashes.items():
        if file_path not in baseline:
            logging.info(f"Criação: {file_path}", extra={'user': getpass.getuser()})
            changes_detected = True
        elif baseline[file_path] != new_hash:
            logging.warning(f"Alteração: {file_path}", extra={'user': getpass.getuser()})
            changes_detected = True
    
    # Verifica exclusões
    for file_path in baseline:
        if file_path not in new_hashes:
            logging.error(f"Exclusão: {file_path}", extra={'user': getpass.getuser()})
            changes_detected = True
    
    # Detecta duplicatas nos arquivos atuais
    detect_duplicates(new_hashes)
    
    # Atualiza o baseline e cria backup após detecção
    if changes_detected:
        with open('hashes.json', 'w') as json_file:
            json.dump(new_hashes, json_file, indent=4)
        create_backup('hashes.json')
        print("Mudanças detectadas. Baseline atualizado e backup criado. Verifique o arquivo logs_monitor.log.")
    else:
        print("Nenhuma mudança detectada.")

if __name__ == "__main__":
    directory = '/home/rayblade/Documentos/Seguranca/'  # Caminho hardcoded
    baseline_file = 'hashes.json'
    log_file = 'logs_monitor.log'
    report_file = 'relatorio.md'
    
    # Verifica se o diretório existe
    if not os.path.isdir(directory):
        print(f"Erro: O diretório '{directory}' não existe.")
        exit(1)
    
    # Se o baseline não existe, gera um
    if not os.path.exists(baseline_file):
        print("Gerando baseline inicial...")
        generate_baseline(directory)
    
    # Detecta mudanças
    detect_changes(directory, baseline_file)
    
    # Gera o relatório
    generate_report(log_file, report_file)