// ===== CONFIGURAÇÃO DE LANCELOTS =====

// Configurações das variantes
const LANCELOT_CONFIGS = {
  none: {
    title: "⚠️ NENHUMA VARIANTE SELECIONADA",
    description:
      "Selecione pelo menos uma variante para ver as informações de preparação e regras.",
    empty: true,
  },

  var1: {
    title: "🌀 TROCAS OCULTAS (Var 1)",
    preparacao: [
      "Baralho: 3 vazias + 2 trocas (virado para baixo)",
      "Lancelot Mau mostra polegar (não abre olhos)",
      "Lancelots NÃO se reconhecem",
    ],
    durante: [
      "A partir da 3ª rodada, revele 1 carta por turno",
      "Lancelots podem BLEFAR livremente",
      "Trocas são completamente secretas",
    ],
    tendencia: "🔴 Pró-Mal | 🌪️ Caos total",
    ideal: "5-7 jogadores",
    // Dados técnicos
    deckSize: 5,
    deckRevealed: false,
    startsAt: 3,
    mandatory: false,
    recognition: false,
  },

  var2: {
    title: "📅 TROCAS PREDETERMINADAS (Var 2)",
    preparacao: [
      "Baralho: 5 vazias + 2 trocas (5 reveladas ANTES)",
      "Lancelot Mau mostra polegar (não abre olhos)",
      "Lancelots NÃO se reconhecem",
    ],
    durante: [
      "Troca automática nas rodadas indicadas",
      "Cartas de missão OBRIGATÓRIAS",
      "Todos sabem QUANDO trocar",
    ],
    tendencia: "🔵 Pró-Bem | 🧠 Dedução estratégica",
    ideal: "7-9 jogadores",
    avisos: ["Prepare 5 cartas VISÍVEIS antes de iniciar o jogo"],
    // Dados técnicos
    deckSize: 7,
    deckRevealed: true,
    startsAt: 1,
    mandatory: true,
    recognition: false,
  },

  var3: {
    title: "👁️ RECONHECIMENTO MÚTUO (Var 3)",
    preparacao: [
      "SEM baralho de Lealdade",
      "SEM trocas de lealdade",
      "Lancelots se reconhecem entre si",
    ],
    durante: ["Nenhuma troca ocorre", "Apenas jogo psicológico de identidades"],
    tendencia: "🔵 Pró-Bem | 🎭 Jogo social",
    ideal: "8-10 jogadores iniciantes",
    // Dados técnicos
    deckSize: 0,
    deckRevealed: false,
    startsAt: 0,
    mandatory: false,
    recognition: true,
  },

  var1_var2: {
    title: "🎲 CAOS CONTROLADO (Var 1 + Obrigatoriedade)",
    preparacao: [
      "Baralho: 5 vazias + 2 trocas (virado para baixo)",
      "Lancelot Mau mostra polegar (não abre olhos)",
      "Lancelots NÃO se reconhecem",
    ],
    durante: [
      "No início de CADA rodada (1ª a 5ª), revele 1 carta",
      "Cartas de missão OBRIGATÓRIAS",
      "Trocas secretas mas missões confiáveis",
    ],
    tendencia: "🔵 Pró-Bem | ⚖️ Equilibrado",
    ideal: "5-7 jogadores",
    // Dados técnicos
    deckSize: 7,
    deckRevealed: false,
    startsAt: 1,
    mandatory: true,
    recognition: false,
  },

  var1_var3: {
    title: "✨ CAOS CONSCIENTE (Var 1 + Var 3)",
    preparacao: [
      "Baralho: 3 vazias + 2 trocas (virado para baixo)",
      "Lancelot Mau mostra polegar (não abre olhos)",
      "Lancelots se reconhecem entre si",
    ],
    durante: [
      "A partir da 3ª rodada, revele 1 carta por turno",
      "Lancelots podem BLEFAR nas missões",
      "Apenas os 2 Lancelots sabem o estado real",
    ],
    tendencia: "🔴 Pró-Mal | 🎭 Alta tensão social",
    ideal: "8-10 jogadores experientes",
    // Dados técnicos
    deckSize: 5,
    deckRevealed: false,
    startsAt: 3,
    mandatory: false,
    recognition: true,
  },

  var2_var3: {
    title: "📊 TROCA PREVISÍVEL (Var 2 + Var 3)",
    preparacao: [
      "Baralho: 5 vazias + 2 trocas (5 reveladas ANTES)",
      "Lancelot Mau mostra polegar (não abre olhos)",
      "Lancelots se reconhecem entre si",
    ],
    durante: [
      "Troca automática nas rodadas indicadas",
      "Cartas de missão OBRIGATÓRIAS",
      "Todos sabem QUANDO trocar",
      "Jogo psicológico entre os Lancelots",
    ],
    tendencia: "🔵 Pró-Bem | 🧠 Dedução limpa",
    ideal: "8-10 jogadores experientes",
    avisos: ["Prepare 5 cartas VISÍVEIS antes de iniciar o jogo"],
    // Dados técnicos
    deckSize: 7,
    deckRevealed: true,
    startsAt: 1,
    mandatory: true,
    recognition: true,
  },
};

// Adicionar métodos à classe AvalonApp
AvalonApp.prototype.openLancelotConfig = function () {
  // Resetar seleções
  this.lancelotVariants = {
    var1: false,
    var2: false,
    var3: false,
  };

  // Limpar checkboxes
  document.getElementById("lancelotVar1").checked = false;
  document.getElementById("lancelotVar2").checked = false;
  document.getElementById("lancelotVar3").checked = false;

  // Habilitar todos
  document.getElementById("lancelotVar1").disabled = false;
  document.getElementById("lancelotVar2").disabled = false;
  document.getElementById("lancelotVar3").disabled = false;

  // Atualizar preview
  this.updateLancelotPreview();

  // Abrir modal
  document.getElementById("lancelotConfigModal").style.display = "flex";
};

AvalonApp.prototype.closeLancelotConfig = function () {
  document.getElementById("lancelotConfigModal").style.display = "none";
};

AvalonApp.prototype.toggleLancelotVariant = function (variant, checked) {
  // Atualizar estado
  this.lancelotVariants[`var${variant}`] = checked;

  // Contar quantas estão selecionadas
  const selectedCount = Object.values(this.lancelotVariants).filter(
    Boolean,
  ).length;

  // Se 2 estão selecionadas, desabilitar a que não está
  if (selectedCount === 2) {
    if (!this.lancelotVariants.var1) {
      document.getElementById("lancelotVar1").disabled = true;
    }
    if (!this.lancelotVariants.var2) {
      document.getElementById("lancelotVar2").disabled = true;
    }
    if (!this.lancelotVariants.var3) {
      document.getElementById("lancelotVar3").disabled = true;
    }
  } else {
    // Habilitar todos
    document.getElementById("lancelotVar1").disabled = false;
    document.getElementById("lancelotVar2").disabled = false;
    document.getElementById("lancelotVar3").disabled = false;
  }

  // Atualizar preview
  this.updateLancelotPreview();

  // Habilitar/desabilitar botão confirmar
  const confirmBtn = document.getElementById("lancelotConfirmBtn");
  confirmBtn.disabled = selectedCount === 0;
};

AvalonApp.prototype.getLancelotConfigKey = function () {
  const { var1, var2, var3 } = this.lancelotVariants;

  // Nenhuma selecionada
  if (!var1 && !var2 && !var3) return "none";

  // Apenas 1
  if (var1 && !var2 && !var3) return "var1";
  if (!var1 && var2 && !var3) return "var2";
  if (!var1 && !var2 && var3) return "var3";

  // Combinações (2)
  if (var1 && var2 && !var3) return "var1_var2";
  if (var1 && !var2 && var3) return "var1_var3";
  if (!var1 && var2 && var3) return "var2_var3";

  // Fallback
  return "none";
};

AvalonApp.prototype.updateLancelotPreview = function () {
  const previewDiv = document.getElementById("lancelotPreview");
  const configKey = this.getLancelotConfigKey();
  const config = LANCELOT_CONFIGS[configKey];

  if (!config || config.empty) {
    // Mostrar estado vazio
    previewDiv.innerHTML = `
      <div class="preview-empty">
        <i class="fas fa-info-circle"></i>
        <p><strong>⚠️ NENHUMA VARIANTE SELECIONADA</strong></p>
        <p>Selecione pelo menos uma variante para ver as informações de preparação e regras.</p>
      </div>
    `;
    return;
  }

  // Montar preview completo
  let html = `
    <div class="preview-title">${config.title}</div>
    
    <div class="preview-section">
      <div class="preview-section-title">
        <i class="fas fa-cog"></i> Preparação
      </div>
      <ul class="preview-list">
        ${config.preparacao.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
    
    <div class="preview-section">
      <div class="preview-section-title">
        <i class="fas fa-gamepad"></i> Durante o Jogo
      </div>
      <ul class="preview-list">
        ${config.durante.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>
    
    <div class="preview-meta">
      <div class="preview-meta-item">
        <div class="preview-meta-label">⚖️ Tendência</div>
        <div class="preview-meta-value">${config.tendencia}</div>
      </div>
      <div class="preview-meta-item">
        <div class="preview-meta-label">👥 Ideal para</div>
        <div class="preview-meta-value">${config.ideal}</div>
      </div>
    </div>
  `;

  // Adicionar avisos se existirem
  if (config.avisos && config.avisos.length > 0) {
    html += `
      <div class="preview-avisos">
        <div class="preview-avisos-title">
          <i class="fas fa-exclamation-triangle"></i> Avisos
        </div>
        <ul>
          ${config.avisos.map((aviso) => `<li>${aviso}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  previewDiv.innerHTML = html;
};

AvalonApp.prototype.confirmLancelotConfig = function () {
  const configKey = this.getLancelotConfigKey();
  const config = LANCELOT_CONFIGS[configKey];

  if (!config || config.empty) {
    alert("Selecione pelo menos uma variante antes de confirmar.");
    return;
  }

  // Salvar configuração
  this.lancelotConfig = {
    variant: configKey,
    deckSize: config.deckSize,
    deckRevealed: config.deckRevealed,
    startsAt: config.startsAt,
    mandatory: config.mandatory,
    recognition: config.recognition,
  };

  console.log("[AVALON] Configuração de Lancelots salva:", this.lancelotConfig);

  // Fechar modal
  this.closeLancelotConfig();

  // Atualizar interface
  this.renderRoles();
};

// Aguardar que o app seja carregado
window.addEventListener("DOMContentLoaded", function () {
  if (typeof app !== "undefined") {
    // Inicializar estado de variantes
    app.lancelotVariants = {
      var1: false,
      var2: false,
      var3: false,
    };

    app.lancelotConfig = {
      variant: null,
      deckSize: 0,
      deckRevealed: false,
      startsAt: 0,
      mandatory: false,
      recognition: false,
    };

    console.log("[AVALON] Sistema de configuração de Lancelots carregado");
  }
});
