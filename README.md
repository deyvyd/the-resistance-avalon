# 🏰 The Resistance: AVALON - Assistente Digital

Sistema completo de narração automática e gerenciamento de jogo para **The Resistance: AVALON**, com interface web interativa, manual de regras e guia dinâmico do jogo.

## 📋 Sobre o Projeto

Este assistente digital facilita a experiência de jogo do Avalon, eliminando a necessidade de um mestre humano para conduzir a revelação inicial. O sistema:

- **Narra automaticamente** a sequência de revelação de personagens
- **Gerencia configurações** de personagens e jogadores
- **Reproduz áudios** sincronizados com música de fundo
- **Inclui manual completo** em português brasileiro
- **Oferece guia interativo** com etapas do jogo

## ✨ Funcionalidades

### 🎮 Configuração de Jogo

- Seleção de 5 a 10 jogadores
- Escolha de personagens obrigatórios e opcionais
- Balanceamento automático de times (Bem vs Mal)
- Visualização em tempo real da composição dos times

### 🎵 Sistema de Narração

- 14 áudios de narração profissional
- Música de fundo ambiente (seleção e narração)
- Controles de volume independentes
- Pausas configuráveis entre áudios (1-10s)
- Navegação por etapas (anterior/próxima)
- Contador visual de pausas

### 📖 Manual Interativo

- Regras completas em português
- Sistema de accordion (abrir/fechar seções)
- Navegação flutuante lateral
- Tooltips com termos em inglês
- Seções incluídas:
  - 🎯 Objetivo do Jogo
  - ⚙️ Preparação
  - 🎮 Como Jogar
  - 👨🏻‍👩🏻‍👧🏻‍👧🏻 Personagens Especiais
  - 🏁 Final do Jogo
  - 📋 Regras Opcionais Avançadas
  - 💡 Dicas Estratégicas

### 🗺️ Guia do Jogo

- Etapas dinâmicas baseadas em recursos selecionados
- Recursos opcionais:
  - 🔄 Lancelots (troca de lado)
  - 🗡️ Excalibur
  - 🎯 Missão Alvo
  - 💧 Mulher do Lago
- Navegação por etapas com contador
- Condições de vitória detalhadas

## 🎭 Personagens Suportados

### Obrigatórios

- 🧙🏻‍♂️ **Merlin** (Bem) - Conhece os servos do mal
- 💀 **Assassino** (Mal) - Tenta identificar Merlin

### Opcionais - Bem

- 👁️ **Percival** - Conhece Merlin e Morgana
- 👍🏻 **Lancelot Bom** - Par com Lancelot Mal

### Opcionais - Mal

- 🧙‍♀️ **Morgana** - Aparece como Merlin para Percival
- 🐍 **Mordred** - Invisível para Merlin
- 👻 **Oberon** - Não conhece outros servos
- 👎🏻 **Lancelot Mal** - Par com Lancelot Bom

### Automáticos

- 🛡️ **Servos de Arthur** - Preenchem vagas do Bem
- 🗡️ **Minions de Mordred** - Preenchem vagas do Mal

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização responsiva com gradientes e animações
- **JavaScript (ES6+)** - Lógica do aplicativo
- **Web Audio API** - Reprodução de áudios
- **LocalStorage** - Persistência de configurações
- **Font Awesome** - Ícones
- **Google Fonts** (Cinzel, Lato) - Tipografia temática

## 📁 Estrutura de Arquivos

```
avalon/
├── index.html              # Página principal
├── manual.html             # Manual de regras
├── styles.css              # Estilos globais
├── app-mp3.js             # Lógica principal
├── game-guide.js          # Sistema de guia do jogo
└── src/
    └── assets/
        ├── audios/        # Arquivos MP3 (1-14 + músicas)
        └── fontawesome/   # Ícones Font Awesome
```

## 🚀 Como Usar

1. Acesse o [site](https://deyvyd.github.io/the-resistance-avalon)
2. Selecione o número de jogadores (5-10)
3. Escolha os personagens que participarão da partida
4. Clique em **"Iniciar Narração"**
5. Siga as instruções do áudio

### ⚙️ Configurações Disponíveis

- Música de fundo (ligar/desligar + volume)
- Volume da narração (50-150%)
- Timer de pausas (1-10 segundos)

## 🎯 Sequência de Narração

O sistema adapta automaticamente a sequência baseada nos personagens selecionados:

1. Introdução ao Avalon
2. Preparação (olhos fechados)
3. Servos do mal se reconhecem
4. Merlin vê os servos do mal
5. Percival vê Merlin (se ativo)
6. Lancelots se reconhecem (se ativo, 7+ jogadores)
7. Encerramento

## 📱 Responsividade

Interface totalmente responsiva para:

- 💻 Desktop (1200px+)
- 📱 Tablet (768px-1199px)
- 📱 Mobile (< 768px)

## 🎨 Design

- Tema medieval/fantasia com paleta dourada
- Gradientes e sombras para profundidade
- Animações suaves de transição
- Tipografia temática (Cinzel + Lato)
- Modo escuro nativo

## 🔊 Áudios Necessários

Coloque os arquivos na pasta `src/assets/audios/`:

### Narração

- `1.mp3` - Introdução
- `2.mp3` - Preparação
- `3.mp3` / `3-lancelot.mp3` - Servos levantam polegar
- `4.mp3` / `4-oberon.mp3` / `4-lancelot.mp3` / `4-oberon-lancelot.mp3` - Reconhecimento
- `5.mp3` / `5-mordred.mp3` / `5-lancelot.mp3` / `5-mordred-lancelot.mp3` - Fecham olhos
- `6.mp3` - Merlin abre olhos
- `7.mp3` - Merlin fecha olhos
- `8.mp3` / `8-morgana.mp3` - Merlin/Morgana polegar
- `9.mp3` / `9-morgana.mp3` - Percival vê
- `10.mp3` - Percival fecha olhos
- `11.mp3` - Lancelots se reconhecem
- `12.mp3` - Lancelots fecham olhos
- `13.mp3` - Todos abrem olhos
- `14.mp3` - Início do jogo

### Músicas de Fundo

- `soundtrack-selection.mp3` - Tela de seleção
- `soundtrack-narration.mp3` - Durante narração

## 📝 Notas

- Configurações são salvas automaticamente no navegador
- Funciona offline após primeiro carregamento
- Compatível com Chrome, Firefox, Safari, Edge

## 🤝 Créditos

- **Design original do jogo**: Don Eskridge
- **Design e conteúdo da aplicação**: Deyvyd Moura
- **Adaptação digital**: Sistema de assistente MP3
- **Tradução PT-BR**: Manual completo e interface

## 📄 Licença

Projeto educacional para facilitar partidas de The Resistance: AVALON. Todos os direitos do jogo original pertencem aos seus criadores.

---

**Desenvolvido com ⚔️ para a comunidade Avalon**
