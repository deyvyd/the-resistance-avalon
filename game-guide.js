// ===== GUIA DO JOGO - CONTROLE DE ETAPAS DINÂMICAS =====

// Adicionar métodos à classe AvalonApp
AvalonApp.prototype.openGameGuide = function () {
  document.getElementById("gameGuideModal").style.display = "flex";
  this.updateGameSteps();
};

AvalonApp.prototype.closeGameGuide = function () {
  document.getElementById("gameGuideModal").style.display = "none";
};

AvalonApp.prototype.updateGameSteps = function () {
  const lancelots = document.getElementById("toggleLancelots").checked;
  const excalibur = document.getElementById("toggleExcalibur").checked;
  const targeting = document.getElementById("toggleTargeting").checked;
  const ladyOfLake = document.getElementById("toggleLadyOfLake").checked;

  const steps = this.generateGameSteps(
    lancelots,
    excalibur,
    targeting,
    ladyOfLake
  );
  this.renderGameSteps(steps);
};

AvalonApp.prototype.generateGameSteps = function (
  lancelots,
  excalibur,
  targeting,
  ladyOfLake
) {
  const steps = [];
  let stepNumber = 1;

  // ===== PREPARAÇÃO =====
  steps.push({
    number: stepNumber++,
    title: "🃏 Preparação do Jogo",
    actions: [
      "Embaralhe as cartas de personagem conforme o número de jogadores",
      "Distribua as cartas secretamente para cada jogador",
      "Cada jogador olha sua carta sem revelar aos outros",
    ],
    type: "setup",
    badges: ["Preparação"],
  });

  // ===== REVELAÇÃO INICIAL =====
  steps.push({
    number: stepNumber++,
    title: "🗣️ Narração Inicial",
    description: lancelots
      ? "O mal se reconhece, Merlin reconhece o mal, e os Lancelots se reconhecem."
      : "O mal se reconhece e Merlin reconhece o mal.",
    type: "revelation",
    badges: ["Revelação"],
  });

  // LANCELOTS - TROCA DE LADO (se ativo)
  if (lancelots) {
    steps.push({
      number: stepNumber++,
      title: "🔄 Troca de Lado dos Lancelots",
      actions: [
        "A partir da 3ª rodada e em cada rodada seguinte, vire 1 carta do baralho de Lealdade",
        "Se for Sem Mudança: Nada acontece, jogo continua",
        "Se for Troca de Lado: Os dois Lancelots TROCAM DE LADO secretamente!",
      ],
      type: "optional",
      badges: ["Opcional"],
      note: "A troca afeta tudo: condições de vitória, cartas de missão e estratégia",
    });
  }

  // ===== FASE DE JOGO =====
  steps.push({
    number: stepNumber++,
    title: "👑 Definição do Líder da Rodada",
    description: "A liderança é alterada a cada rodada no sentido horário.",
    type: "mission",
    badges: ["Missão"],
    note: "O primeiro líder é decidido aleatoriamente no início do jogo.",
  });

  // SEGMENTAÇÃO DE MISSÕES (se ativo)
  if (targeting) {
    steps.push({
      number: stepNumber++,
      title: "🎯 Missão Alvo - Fase de Escolha da Missão",
      actions: [
        "O líder pode escolher QUAL missão a equipe tentará completar (em qualquer ordem)",
        "A 5ª missão só pode ser tentada após 2 missões bem-sucedidas",
        "Uma missão tentada não pode ser tentada novamente",
      ],
      type: "optional",
      badges: ["Opcional"],
    });
  }

  // ===== CICLO DE RODADAS =====
  steps.push({
    number: stepNumber++,
    title: "👨🏻‍👩🏻‍👧🏻‍👧🏻 Fase de Formação de Equipe",
    actions: [
      "O líder propõe uma equipe para a missão e todos discutem a proposta",
      "Cada jogador vota secretamente (Aprovar/Rejeitar) e todos exibem os votos simultaneamente",
      "Se a maioria aprovar: a equipe vai para a missão",
      "Se for rejeitada: volta pra o passo de definição do líder",
    ],
    type: "mission",
    badges: ["Missão"],
    note: "5 rejeições consecutivas = Mal vence automaticamente!",
  });

  // EXCALIBUR (se ativo) - VEM APÓS FORMAÇÃO DE EQUIPE
  if (excalibur) {
    steps.push({
      number: stepNumber++,
      title: "🗡️ Uso de Excalibur",
      actions: [
        "O líder dá Excalibur a UM membro da equipe (não pode ser ele mesmo)",
        "Cada jogador da equipe coloca sua carta virada para baixo na sua frente",
        "ANTES de coletar as cartas, o portador de Excalibur pode mandar UM jogador trocar sua carta",
        "O portador olha a carta original do jogador (para saber qual foi a escolha inicial)",
        "O líder então coleta e embaralha as cartas normalmente",
      ],
      type: "optional",
      badges: ["Opcional"],
      note: "Pode ser usado pelo Bem ou pelo Mal para alterar estrategicamente o resultado!",
    });
  }

  steps.push({
    number: stepNumber++,
    title: "⚔️ Fase da Missão",
    actions: [
      "Cada membro da equipe recebe cartas de Missão (Sucesso/Falha)",
      "Cada um escolhe secretamente uma carta e joga virada para baixo",
      "O líder embaralha e revela as cartas jogadas",
      "Missão é SUCESSO: se TODAS as cartas forem Sucesso",
      "Missão FALHA: se houver uma ou mais cartas de Falha",
    ],
    type: "mission",
    badges: ["Missão"],
    note: "O BEM só pode jogar cartas de Sucesso. O MAL pode jogar Sucesso ou Falha.",
    note: "4ª missão com 7+ jogadores precisa de 2 Falhas para falhar",
  });

  // MULHER DO LAGO (se ativo) - VEM APÓS FASE DA MISSÃO
  if (ladyOfLake) {
    steps.push({
      number: stepNumber++,
      title: "💧 Mulher do Lago",
      actions: [
        "Após a 2ª, 3ª e 4ª missões, o portador do token escolhe outro jogador para examinar",
        "O jogador examinado recebe as 2 Cartas de Lealdade e passa secretamente a carta correspondente à sua lealdade",
        "O portador vê a lealdade (Bem ou Mal) e pode discutir sobre o que viu",
        "O jogador examinado recebe o token da Mulher do Lago",
        "Um jogador que já usou a Mulher do Lago não pode ser examinado",
      ],
      type: "optional",
      badges: ["Opcional"],
      note: "Passar a carta errada resulta em perda automática!",
    });
  }

  steps.push({
    number: stepNumber++,
    title: "⏭️ Próxima Rodada",
    actions: [
      "Marque o resultado no tabuleiro (Sucesso ou Falha)",
      "Passe a liderança para o próximo jogador (sentido horário)",
      "Continue até que um lado vença (3 sucessos ou 3 falhas)",
    ],
    type: "mission",
    badges: ["Missão"],
  });

  // ===== FINAL DO JOGO =====
  steps.push({
    number: stepNumber++,
    title: "🏆 Condições de Vitória",
    actions: [
      "BEM vence: 3 missões bem-sucedidas + Merlin sobrevive ao assassinato",
      "MAL vence: 3 missões falham OU 5 times rejeitados consecutivamente OU assassinar Merlin corretamente",
    ],
    type: "endgame",
    badges: ["Final"],
  });

  steps.push({
    number: stepNumber++,
    title: "💀 Tentativa de Assassinato",
    actions: [
      "Se o Bem completar 3 missões, o jogo NÃO termina imediatamente",
      "Os jogadores do mal discutem entre si (sem revelar cartas)",
      "O Assassino aponta para um jogador do bem",
      "Se for Merlin: MAL VENCE!",
      "Se NÃO for Merlin: BEM VENCE!",
    ],
    type: "endgame",
    badges: ["Final"],
    note: "Esta é a última chance do Mal! Merlin deve ter sido sutil durante o jogo.",
  });

  return steps;
};

AvalonApp.prototype.renderGameSteps = function (steps) {
  const container = document.getElementById("gameStepsContainer");
  container.innerHTML = "";

  steps.forEach((step) => {
    const stepDiv = document.createElement("div");
    stepDiv.className = `game-step step-${step.type}`;

    // Número da etapa
    const numberDiv = document.createElement("div");
    numberDiv.className = "step-number";
    numberDiv.textContent = step.number;

    // Conteúdo da etapa
    const contentDiv = document.createElement("div");
    contentDiv.className = "step-content";

    const titleDiv = document.createElement("div");
    titleDiv.className = "step-title";
    titleDiv.textContent = step.title;

    contentDiv.appendChild(titleDiv);

    // Descrição ou Lista de Ações
    if (step.description) {
      // Texto simples (parágrafo)
      const descDiv = document.createElement("div");
      descDiv.className = "step-description";
      descDiv.textContent = step.description;
      contentDiv.appendChild(descDiv);
    } else if (step.actions && step.actions.length > 0) {
      // Lista ordenada de ações
      const actionsOl = document.createElement("ol");
      actionsOl.className = "step-actions";
      actionsOl.style.paddingLeft = "20px";
      actionsOl.style.margin = "8px 0";
      actionsOl.style.color = "#e0e0e0";
      actionsOl.style.lineHeight = "1.8";

      step.actions.forEach((action) => {
        const li = document.createElement("li");
        li.textContent = action;
        li.style.marginBottom = "6px";
        actionsOl.appendChild(li);
      });

      contentDiv.appendChild(actionsOl);
    }

    // Nota adicional (se houver)
    if (step.note) {
      const noteDiv = document.createElement("div");
      noteDiv.className = "step-description";
      noteDiv.style.fontStyle = "italic";
      noteDiv.style.color = "#ffb84d";
      noteDiv.style.marginTop = "8px";
      noteDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${step.note}`;
      contentDiv.appendChild(noteDiv);
    }

    // Badges
    if (step.badges && step.badges.length > 0) {
      const badgesDiv = document.createElement("div");
      badgesDiv.className = "step-badges";

      step.badges.forEach((badge) => {
        const badgeSpan = document.createElement("span");

        // Mapeamento de badges para classes CSS
        const badgeClassMap = {
          Preparação: "badge-setup",
          Revelação: "badge-revelation",
          Missão: "badge-mission",
          Opcional: "badge-optional",
          Final: "badge-endgame",
        };

        const badgeClass = badgeClassMap[badge] || "badge-setup";
        badgeSpan.className = `step-badge ${badgeClass}`;
        badgeSpan.textContent = badge.toUpperCase();
        badgesDiv.appendChild(badgeSpan);
      });

      contentDiv.appendChild(badgesDiv);
    }

    stepDiv.appendChild(numberDiv);
    stepDiv.appendChild(contentDiv);
    container.appendChild(stepDiv);
  });
};

// Aguardar que o app seja carregado
window.addEventListener("DOMContentLoaded", function () {
  // Garantir que os métodos estão disponíveis
  if (typeof app !== "undefined") {
    console.log("[AVALON] Guia do Jogo carregado com sucesso");
  }
});
