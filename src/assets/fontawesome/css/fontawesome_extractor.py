#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para extrair ícones do Font Awesome do arquivo all.css
e gerar um arquivo com mapeamento no formato JavaScript
"""

import re
import os
from typing import Set, Dict, List


def extrair_icones_css(caminho_arquivo: str) -> Set[str]:
    """
    Extrai todos os nomes de ícones do arquivo CSS do Font Awesome
    
    Args:
        caminho_arquivo (str): Caminho para o arquivo all.css
        
    Returns:
        Set[str]: Conjunto com todos os nomes únicos de ícones
    """
    icones = set()
    
    try:
        with open(caminho_arquivo, 'r', encoding='utf-8') as arquivo:
            conteudo = arquivo.read()
        
        # Regex para capturar seletores .fa-*
        padrao = r'\.fa-([a-z0-9-]+)\s*{'
        matches = re.findall(padrao, conteudo)
        
        for match in matches:
            nome_icone = match.strip()
            
            # Filtrar casos especiais que não são ícones válidos
            if (not nome_icone.startswith('sr-') and 
                not '--' in nome_icone and 
                nome_icone not in ['brands', 'solid', 'regular', 'light', 'duotone']):
                icones.add(nome_icone)
        
        print(f"Extraídos {len(icones)} ícones únicos do arquivo CSS")
        return icones
        
    except FileNotFoundError:
        print(f"Erro: Arquivo {caminho_arquivo} não encontrado!")
        return set()
    except Exception as e:
        print(f"Erro ao processar arquivo: {e}")
        return set()


def detectar_estilo_icone(nome_icone: str) -> str:
    """
    Detecta o estilo mais apropriado para cada ícone
    
    Args:
        nome_icone (str): Nome do ícone
        
    Returns:
        str: Estilo do ícone (fas, far, fab)
    """
    # Ícones que geralmente são brands
    brands_keywords = [
        'google', 'facebook', 'twitter', 'instagram', 'linkedin', 'github',
        'youtube', 'amazon', 'apple', 'microsoft', 'android', 'windows',
        'chrome', 'firefox', 'safari', 'edge', 'opera', 'spotify', 'discord',
        'whatsapp', 'telegram', 'skype', 'zoom', 'slack', 'dropbox', 'paypal',
        'visa', 'mastercard', 'bitcoin', 'ethereum', 'wordpress', 'drupal',
        'joomla', 'bootstrap', 'react', 'angular', 'vue', 'node', 'npm',
        'docker', 'ubuntu', 'fedora', 'centos', 'debian', 'redhat'
    ]
    
    # Verificar se é brand
    for keyword in brands_keywords:
        if keyword in nome_icone:
            return 'fab'

    
    # Por padrão, usar regular (FAR)
    return 'far'


def criar_aliases_comuns() -> Dict[str, str]:
    """
    Cria um dicionário com aliases comuns para ícones
    
    Returns:
        Dict[str, str]: Dicionário com aliases
    """
    return {
        'settings': 'cog',
        'config': 'cog',
        'configuration': 'cog',
        'options': 'cog',
        'preferences': 'cog',
        
        'menu': 'bars',
        'hamburger': 'bars',
        'navigation': 'bars',
        
        'remove': 'trash',
        'delete': 'trash',
        'bin': 'trash',
        'garbage': 'trash',
        
        'find': 'search',
        'lookup': 'search',
        'locate': 'search',
        
        'modify': 'edit',
        'change': 'edit',
        'update': 'edit',
        'pencil': 'edit',
        
        'person': 'user',
        'profile': 'user',
        'account': 'user',
        
        'people': 'users',
        'group': 'users',
        'team': 'users',
        
        'house': 'home',
        'main': 'home',
        'index': 'home',
        
        'gear': 'cog',
        'wrench': 'cog',
        'tools': 'cog',
        
        'mail': 'envelope',
        'email': 'envelope',
        'message': 'envelope',
        
        'phone': 'phone-alt',
        'call': 'phone-alt',
        'telephone': 'phone-alt',
    }


def gerar_arquivo_icones(icones: Set[str], arquivo_saida: str = 'icones_fontawesome.txt'):
    """
    Gera arquivo com mapeamento de ícones no formato JavaScript
    
    Args:
        icones (Set[str]): Conjunto de ícones extraídos
        arquivo_saida (str): Nome do arquivo de saída
    """
    icones_ordenados = sorted(list(icones))
    aliases = criar_aliases_comuns()
    
    try:
        with open(arquivo_saida, 'w', encoding='utf-8') as arquivo:
            arquivo.write("// Mapeamento de ícones Font Awesome extraídos automaticamente\n")
            arquivo.write("// Gerado por fontawesome_extractor.py\n\n")
            arquivo.write("const iconesDisponiveis = {\n")
            
            # Escrever ícones principais
            for icone in icones_ordenados:
                estilo = detectar_estilo_icone(icone)
                linha = f"    '{icone}': '{estilo} fa-{icone}',\n"
                arquivo.write(linha)
            
            arquivo.write("\n    // Aliases comuns\n")
            
            # Escrever aliases
            for alias, icone_real in aliases.items():
                if icone_real in icones:
                    estilo = detectar_estilo_icone(icone_real)
                    linha = f"    '{alias}': '{estilo} fa-{icone_real}',\n"
                    arquivo.write(linha)
            
            arquivo.write("};\n\n")
            
            # Adicionar função de busca
            arquivo.write("// Função para buscar ícone\n")
            arquivo.write("function obterIcone(nome) {\n")
            arquivo.write("    return iconesDisponiveis[nome] || 'far fa-question';\n")
            arquivo.write("}\n\n")
            
            # Adicionar função de verificação
            arquivo.write("// Função para verificar se ícone existe\n")
            arquivo.write("function iconeExiste(nome) {\n")
            arquivo.write("    return iconesDisponiveis.hasOwnProperty(nome);\n")
            arquivo.write("}\n\n")
            
            # Adicionar estatísticas
            arquivo.write(f"// Estatísticas:\n")
            arquivo.write(f"// Total de ícones: {len(icones)}\n")
            arquivo.write(f"// Total de aliases: {len(aliases)}\n")
            arquivo.write(f"// Total com aliases: {len(icones) + len(aliases)}\n")
        
        print(f"Arquivo '{arquivo_saida}' gerado com sucesso!")
        print(f"Total de ícones: {len(icones)}")
        print(f"Total de aliases: {len(aliases)}")
        
    except Exception as e:
        print(f"Erro ao gerar arquivo: {e}")


def gerar_relatorio_categorias(icones: Set[str], arquivo_relatorio: str = 'relatorio_icones.txt'):
    """
    Gera relatório com ícones categorizados
    
    Args:
        icones (Set[str]): Conjunto de ícones
        arquivo_relatorio (str): Nome do arquivo de relatório
    """
    categorias = {
        'Solid (fas)': [],
        'Regular (far)': [],
        'Brands (fab)': []
    }
    
    for icone in sorted(icones):
        estilo = detectar_estilo_icone(icone)
        if estilo == 'fas':
            categorias['Solid (fas)'].append(icone)
        elif estilo == 'far':
            categorias['Regular (far)'].append(icone)
        elif estilo == 'fab':
            categorias['Brands (fab)'].append(icone)
    
    try:
        with open(arquivo_relatorio, 'w', encoding='utf-8') as arquivo:
            arquivo.write("RELATÓRIO DE ÍCONES FONT AWESOME\n")
            arquivo.write("=" * 50 + "\n\n")
            
            for categoria, lista_icones in categorias.items():
                arquivo.write(f"{categoria} ({len(lista_icones)} ícones):\n")
                arquivo.write("-" * 30 + "\n")
                
                for i, icone in enumerate(lista_icones, 1):
                    arquivo.write(f"{i:3d}. {icone}\n")
                
                arquivo.write("\n")
        
        print(f"Relatório salvo em '{arquivo_relatorio}'")
        
    except Exception as e:
        print(f"Erro ao gerar relatório: {e}")


def main():
    """Função principal"""
    print("Font Awesome Icon Extractor")
    print("=" * 30)
    
    # Configurações
    arquivo_css = 'all.css'  # Caminho para o arquivo CSS
    arquivo_saida = 'icones_fontawesome.txt'
    arquivo_relatorio = 'relatorio_icones.txt'
    
    # Verificar se arquivo existe
    if not os.path.exists(arquivo_css):
        print(f"Arquivo '{arquivo_css}' não encontrado!")
        print("Certifique-se de que o arquivo all.css está no mesmo diretório.")
        return
    
    # Extrair ícones
    print(f"Processando arquivo: {arquivo_css}")
    icones = extrair_icones_css(arquivo_css)
    
    if not icones:
        print("Nenhum ícone foi encontrado!")
        return
    
    # Gerar arquivos
    gerar_arquivo_icones(icones, arquivo_saida)
    gerar_relatorio_categorias(icones, arquivo_relatorio)
    
    print(f"\nProcessamento concluído!")
    print(f"Arquivos gerados:")
    print(f"  - {arquivo_saida} (mapeamento JavaScript)")
    print(f"  - {arquivo_relatorio} (relatório por categorias)")


if __name__ == "__main__":
    main()
