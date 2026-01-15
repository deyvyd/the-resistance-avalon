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
    content: [
      {
        type: "action",
        text: "Embaralhe as cartas de personagem conforme o número de jogadores",
      },
      {
        type: "action",
        text: "Distribua as cartas secretamente para cada jogador",
      },
      {
        type: "action",
        text: "Cada jogador olha sua carta sem revelar aos outros",
      },
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
      content: [
        {
          type: "action",
          text: "A partir da 3ª rodada e em cada rodada seguinte, vire 1 carta do baralho de Lealdade",
        },
        {
          type: "action",
          text: "Se for Sem Mudança: Nada acontece, jogo continua",
        },
        {
          type: "action",
          text: "Se for Troca de Lado: Os dois Lancelots TROCAM DE LADO secretamente!",
        },
        {
          type: "note",
          text: "A troca afeta tudo: condições de vitória, cartas de missão e estratégia",
        },
      ],
      type: "optional",
      badges: ["Opcional"],
    });
  }

  // ===== FASE DE JOGO =====
  steps.push({
    number: stepNumber++,
    title: "👑 Definição do Líder da Rodada",
    content: [
      {
        type: "action",
        text: "A liderança é alterada a cada rodada no sentido horário",
      },
      {
        type: "note",
        text: "O primeiro líder é decidido aleatoriamente no início do jogo",
      },
    ],
    type: "mission",
    badges: ["Missão"],
  });

  // SEGMENTAÇÃO DE MISSÕES (se ativo)
  if (targeting) {
    steps.push({
      number: stepNumber++,
      title: "🎯 Missão Alvo - Fase de Escolha da Missão",
      content: [
        {
          type: "action",
          text: "O líder pode escolher QUAL missão a equipe tentará completar (em qualquer ordem)",
        },
        {
          type: "action",
          text: "A 5ª missão só pode ser tentada após 2 missões bem-sucedidas",
        },
        {
          type: "action",
          text: "Uma missão tentada não pode ser tentada novamente",
        },
      ],
      type: "optional",
      badges: ["Opcional"],
    });
  }

  // ===== CICLO DE RODADAS =====
  steps.push({
    number: stepNumber++,
    title: "👨🏻‍👩🏻‍👧🏻‍👧🏻 Fase de Formação de Equipe",
    content: [
      {
        type: "action",
        text: "O líder propõe uma equipe para a missão e todos discutem a proposta",
      },
      {
        type: "action",
        text: "Cada jogador vota secretamente (Aprovar/Rejeitar) e todos exibem os votos simultaneamente",
        subactions: [
          {
            type: "unordered",
            text: "Se a maioria aprovar → A equipe vai para a missão",
          },
          {
            type: "unordered",
            text: "Se a empatar ou a maioria rejeitar → o líder passa a ser o próximo na ordem do jogo (sentido horário)",
          },
        ],
      },
      {
        type: "note",
        text: "5 rejeições consecutivas = Mal vence automaticamente!",
        indented: true,
      },
    ],
    type: "mission",
    badges: ["Missão"],
  });

  // EXCALIBUR (se ativo) - VEM APÓS FORMAÇÃO DE EQUIPE
  if (excalibur) {
    steps.push({
      number: stepNumber++,
      title: "🗡️ Uso de Excalibur",
      content: [
        {
          type: "action",
          text: "O líder dá Excalibur a UM membro da equipe (não pode ser ele mesmo)",
        },
        {
          type: "action",
          text: "Cada jogador da equipe coloca sua carta virada para baixo na sua frente",
        },
        {
          type: "action",
          text: "ANTES de coletar as cartas, o portador de Excalibur pode mandar UM jogador trocar sua carta",
        },
        {
          type: "action",
          text: "O portador olha a carta original do jogador (para saber qual foi a escolha inicial)",
        },
        {
          type: "action",
          text: "O líder então coleta e embaralha as cartas normalmente",
        },
        {
          type: "note",
          text: "Pode ser usado pelo Bem ou pelo Mal para alterar estrategicamente o resultado!",
        },
      ],
      type: "optional",
      badges: ["Opcional"],
    });
  }

  steps.push({
    number: stepNumber++,
    title: "⚔️ Fase da Missão",
    content: [
      {
        type: "action",
        text: "Cada membro da equipe recebe cartas de Missão (Sucesso/Falha) e escolhe secretamente uma para jogar",
      },
      {
        type: "note",
        text: "O BEM só pode jogar cartas de Sucesso. O MAL pode jogar Sucesso ou Falha.",
        indented: true,
      },
      {
        type: "action",
        text: "Cada membro da equipe escolhe joga a carta escolhida virada para baixo",
      },
      {
        type: "action",
        text: "O líder embaralha e revela as cartas jogadas",
        subactions: [
          {
            type: "unordered",
            text: "Se TODAS as cartas forem Sucesso → Missão é SUCESSO",
          },
          {
            type: "unordered",
            text: "Se houver UMA ou mais cartas de Falha → Missão FALHA",
          },
        ],
      },
      {
        type: "note",
        text: "4ª missão com 7+ jogadores precisa de 2 Falhas para falhar",
        indented: true,
      },
    ],
    type: "mission",
    badges: ["Missão"],
  });

  // MULHER DO LAGO (se ativo) - VEM APÓS FASE DA MISSÃO
  if (ladyOfLake) {
    steps.push({
      number: stepNumber++,
      title: "💧 Mulher do Lago",
      content: [
        {
          type: "action",
          text: "Após a 2ª, 3ª e 4ª missões, o portador do token escolhe outro jogador para examinar",
        },
        {
          type: "action",
          text: "O jogador examinado recebe as 2 Cartas de Lealdade e passa secretamente a carta correspondente à sua lealdade",
        },
        {
          type: "action",
          text: "O portador vê a lealdade (Bem ou Mal) e pode discutir sobre o que viu",
        },
        {
          type: "action",
          text: "O jogador examinado recebe o token da Mulher do Lago",
        },
        {
          type: "action",
          text: "Um jogador que já usou a Mulher do Lago não pode ser examinado",
        },
        {
          type: "note",
          text: "Passar a carta errada resulta em perda automática!",
        },
      ],
      type: "optional",
      badges: ["Opcional"],
    });
  }

  steps.push({
    number: stepNumber++,
    title: "⏭️ Próxima Rodada",
    content: [
      {
        type: "action",
        text: "Marque o resultado no tabuleiro (Sucesso ou Falha)",
      },
      {
        type: "action",
        text: "Passe a liderança para o próximo jogador (sentido horário)",
      },
      {
        type: "action",
        text: "Continue até que um lado vença (3 sucessos ou 3 falhas)",
      },
    ],
    type: "mission",
    badges: ["Missão"],
  });

  // ===== FINAL DO JOGO =====

  steps.push({
    number: stepNumber++,
    title: "💀 Tentativa de Assassinato",
    content: [
      {
        type: "action",
        text: "Se o Bem conquister Sucesso em 3 missões, o jogo NÃO termina imediatamente",
      },
      {
        type: "action",
        text: "Os jogadores do mal discutem entre si (sem revelar cartas)",
      },
      {
        type: "action",
        text: "O Assassino aponta para um jogador do bem",
        subactions: [
          { type: "unordered", text: "Se for Merlin: MAL VENCE!" },
          { type: "unordered", text: "Se NÃO for Merlin: BEM VENCE!" },
        ],
      },
      {
        type: "note",
        text: "Esta é a última chance do Mal! Merlin precisa ser sutil para o BEM vencer o jogo.",
      },
    ],
    type: "endgame",
    badges: ["Final"],
  });

  steps.push({
    number: stepNumber++,
    title: "🏆 Condições de Vitória",
    content: [
      {
        type: "action",
        text: "BEM vence: 3 missões bem-sucedidas + Merlin sobrevive ao assassinato",
      },
      {
        type: "action",
        text: "MAL vence: 3 missões falham OU 5 times rejeitados consecutivamente OU conseguir assassinar Merlin",
      },
    ],
    type: "endgame",
    badges: ["Final"],
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

    // Descrição simples (compatibilidade retroativa)
    if (step.description) {
      const descDiv = document.createElement("div");
      descDiv.className = "step-description";
      descDiv.style.paddingLeft = "25px"; // Alinhamento com os números
      descDiv.textContent = step.description;
      contentDiv.appendChild(descDiv);
    }

    // Novo sistema: content (actions + notes intercalados)
    if (step.content && step.content.length > 0) {
      // Contar quantas ações existem
      const actionCount = step.content.filter(
        (item) => item.type === "action"
      ).length;
      const hasMultipleActions = actionCount > 1;

      if (hasMultipleActions) {
        // CASO 1: Múltiplas ações - usar lista ordenada com numeração
        const contentOl = document.createElement("ol");
        contentOl.className = "step-content-list";
        contentOl.style.paddingLeft = "0"; // Sem padding, o span do número funciona como padding
        contentOl.style.margin = "8px 0";
        contentOl.style.listStyle = "none";
        contentOl.style.counterReset = "action-counter";

        let actionCounter = 0;

        step.content.forEach((item) => {
          if (item.type === "action") {
            actionCounter++;
            const li = document.createElement("li");
            li.style.marginBottom = "6px";
            li.style.color = "#e0e0e0";
            li.style.lineHeight = "1.8";
            li.style.position = "relative";
            li.style.paddingLeft = "0";

            // Adicionar numeração manual
            li.innerHTML = `<span style="display: inline-block; width: 25px; color: #ffd700; font-weight: bold;">${actionCounter}.</span>${item.text}`;
            li.setAttribute("data-type", "action");
            contentOl.appendChild(li);

            // Renderizar sub-ações se existirem
            if (item.subactions && item.subactions.length > 0) {
              const subList = document.createElement("ul");
              subList.style.listStyle = "none";
              subList.style.paddingLeft = "25px";
              subList.style.marginTop = "6px";
              subList.style.marginBottom = "6px";

              item.subactions.forEach((subaction) => {
                const subLi = document.createElement("li");
                subLi.style.marginBottom = "4px";
                subLi.style.color = "#e0e0e0";
                subLi.style.lineHeight = "1.6";
                subLi.style.position = "relative";
                subLi.style.paddingLeft = "20px";

                // Determinar o marcador baseado no tipo
                const marker =
                  subaction.type === "ordered"
                    ? `<span style="position: absolute; left: 0; color: #ffd700; font-weight: bold;">${
                        item.subactions.indexOf(subaction) + 1
                      }.</span>`
                    : `<span style="position: absolute; left: 0; color: #ffd700;">•</span>`;

                subLi.innerHTML = `${marker}${subaction.text}`;
                subList.appendChild(subLi);
              });

              // Adicionar sub-lista ao li da ação principal
              li.appendChild(subList);
            }
          } else if (item.type === "note") {
            const noteDiv = document.createElement("div");
            noteDiv.className = "step-note-inline";
            noteDiv.style.fontStyle = "italic";
            noteDiv.style.color = "#ffb84d";
            noteDiv.style.marginTop = "8px";
            noteDiv.style.marginBottom = "8px";
            // Se indented for true, adiciona margem de 25px; senão, 0
            noteDiv.style.marginLeft = item.indented ? "25px" : "0";
            noteDiv.style.padding = "8px 12px";
            noteDiv.style.background = "rgba(255, 184, 77, 0.1)";
            noteDiv.style.borderLeft = "3px solid #ffb84d";
            noteDiv.style.borderRadius = "4px";
            noteDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${item.text}`;

            // Criar um li container para a nota
            const noteLi = document.createElement("li");
            noteLi.style.listStyle = "none";
            noteLi.style.marginBottom = "6px";
            noteLi.appendChild(noteDiv);
            contentOl.appendChild(noteLi);
          }
        });

        contentDiv.appendChild(contentOl);
      } else {
        // CASO 2: Apenas 1 ação - sem numeração, mas com alinhamento
        step.content.forEach((item) => {
          if (item.type === "action") {
            const actionDiv = document.createElement("div");
            actionDiv.className = "step-description";
            actionDiv.style.marginBottom = "8px";
            actionDiv.style.paddingLeft = "25px"; // Alinhamento com os números
            actionDiv.textContent = item.text;
            contentDiv.appendChild(actionDiv);

            // Renderizar sub-ações se existirem
            if (item.subactions && item.subactions.length > 0) {
              const subList = document.createElement("ul");
              subList.style.listStyle = "none";
              subList.style.paddingLeft = "50px"; // 25px base + 25px indent
              subList.style.marginTop = "6px";
              subList.style.marginBottom = "8px";

              item.subactions.forEach((subaction, index) => {
                const subLi = document.createElement("li");
                subLi.style.marginBottom = "4px";
                subLi.style.color = "#e0e0e0";
                subLi.style.lineHeight = "1.6";
                subLi.style.position = "relative";
                subLi.style.paddingLeft = "20px";

                // Determinar o marcador baseado no tipo
                const marker =
                  subaction.type === "ordered"
                    ? `<span style="position: absolute; left: 0; color: #ffd700; font-weight: bold;">${
                        index + 1
                      }.</span>`
                    : `<span style="position: absolute; left: 0; color: #ffd700;">•</span>`;

                subLi.innerHTML = `${marker}${subaction.text}`;
                subList.appendChild(subLi);
              });

              contentDiv.appendChild(subList);
            }
          } else if (item.type === "note") {
            const noteDiv = document.createElement("div");
            noteDiv.className = "step-note-inline";
            noteDiv.style.fontStyle = "italic";
            noteDiv.style.color = "#ffb84d";
            noteDiv.style.marginTop = "8px";
            noteDiv.style.marginBottom = "8px";
            // Se indented for true, adiciona margem de 25px; senão, mantém no nível da ação (25px base)
            noteDiv.style.marginLeft = item.indented ? "50px" : "25px";
            noteDiv.style.padding = "8px 12px";
            noteDiv.style.background = "rgba(255, 184, 77, 0.1)";
            noteDiv.style.borderLeft = "3px solid #ffb84d";
            noteDiv.style.borderRadius = "4px";
            noteDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${item.text}`;
            contentDiv.appendChild(noteDiv);
          }
        });
      }
    }
    // Sistema antigo: actions (compatibilidade retroativa)
    else if (step.actions && step.actions.length > 0) {
      const actionsOl = document.createElement("ol");
      actionsOl.className = "step-actions";
      actionsOl.style.paddingLeft = "25px"; // Padding para a numeração automática do navegador
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

      // Nota antiga (ao final)
      if (step.note) {
        const noteDiv = document.createElement("div");
        noteDiv.className = "step-description";
        noteDiv.style.fontStyle = "italic";
        noteDiv.style.color = "#ffb84d";
        noteDiv.style.marginTop = "8px";
        noteDiv.style.marginLeft = "25px"; // Alinhamento consistente
        noteDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${step.note}`;
        contentDiv.appendChild(noteDiv);
      }
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
