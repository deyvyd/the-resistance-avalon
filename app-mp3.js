// ===== CONFIGURAÇÕES E CONSTANTES =====
const AUDIO_BASE_PATH = "src/assets/audios/";

const ROLE_DEFINITIONS = {
  // Obrigatórios
  merlin: {
    name: "Merlin",
    icon: "🔮",
    team: "good",
    mandatory: true,
    description: "Conhece os servos do mal",
  },
  assassin: {
    name: "Assassino",
    icon: "🗡️",
    team: "evil",
    mandatory: true,
    description: "Tenta identificar Merlin",
  },

  // Opcionais Bem
  percival: {
    name: "Percival",
    icon: "👁️",
    team: "good",
    description: "Conhece Merlin e Morgana",
  },
  lancelotGood: {
    name: "Lancelot Bom",
    icon: "⚔️",
    team: "good",
    description: "Par com Lancelot Mal",
    linkedRole: "lancelotEvil",
  },

  // Opcionais Mal
  morgana: {
    name: "Morgana",
    icon: "🧙‍♀️",
    team: "evil",
    description: "Aparece como Merlin para Percival",
  },
  mordred: {
    name: "Mordred",
    icon: "👤",
    team: "evil",
    description: "Invisível para Merlin",
  },
  oberon: {
    name: "Oberon",
    icon: "🌑",
    team: "evil",
    description: "Não conhece outros servos",
  },
  lancelotEvil: {
    name: "Lancelot Mal",
    icon: "🗡️",
    team: "evil",
    description: "Par com Lancelot Bom",
    linkedRole: "lancelotGood",
  },

  // Preenchimento automático (não editáveis)
  loyalServant: {
    name: "Servos de Arthur",
    icon: "⚔️",
    team: "good",
    auto: true,
    description: "Preenchem vagas restantes",
  },
  evilMinion: {
    name: "Minions de Mordred",
    icon: "🗡️",
    team: "evil",
    auto: true,
    description: "Preenchem vagas restantes",
  },
};

const TEAM_DISTRIBUTION = {
  5: { good: 3, evil: 2 },
  6: { good: 4, evil: 2 },
  7: { good: 4, evil: 3 },
  8: { good: 5, evil: 3 },
  9: { good: 6, evil: 3 },
  10: { good: 6, evil: 4 },
};

// Textos descritivos para cada áudio
const AUDIO_DESCRIPTIONS = {
  1: "Bem-vindos ao Avalon...",
  2: "Todos, fechem os olhos...",
  3: "Servos do mal, levantem o polegar",
  "3-lancelot": "Servos do mal, incluindo o Lancelot mal, levantem o polegar",
  4: "Servos do mal, abram os olhos e conheçam seus companheiros",
  "4-oberon": "Servos do mal, exceto Oberon, abram os olhos...",
  "4-lancelot": "Servos do mal, exceto o Lancelot mal, abram os olhos...",
  "4-oberon-lancelot":
    "Servos do mal, exceto Oberon e o Lancelot mal, abram os olhos...",
  5: "Servos do mal, fechem os olhos",
  "5-mordred": "Servos do mal, fechem os olhos. Mordred, abaixe seu polegar",
  "5-lancelot":
    "Servos do mal, fechem os olhos. Lancelot mal, abaixe seu polegar",
  "5-mordred-lancelot":
    "Servos do mal, fechem os olhos. Mordred e Lancelot mal, abaixem seus polegares",
  6: "Merlin, abra os olhos e veja os servos do mal",
  7: "Servos do mal, abaixem seus polegares. Merlin, feche os olhos",
  8: "Merlin, levante o polegar",
  "8-morgana": "Merlin e Morgana, levantem o polegar",
  9: "Percival, abra os olhos e veja Merlin",
  "9-morgana": "Percival, abra os olhos e veja Merlin e Morgana",
  10: "Percival, feche os olhos. Todos abaixem suas mãos",
  11: "Lancelots, abram os olhos e conheçam um ao outro",
  12: "Lancelots, fechem os olhos",
  13: "Todos podem abrir os olhos",
  14: "Que comecem as missões de Avalon! Boa sorte, cavaleiros e servos",
};

// ===== CLASSE PRINCIPAL DA APLICAÇÃO =====
class AvalonApp {
  constructor() {
    this.players = 5;
    this.roles = {
      merlin: true,
      assassin: true,
      percival: false,
      morgana: false,
      mordred: false,
      oberon: false,
      lancelotGood: false,
      lancelotEvil: false,
    };
    this.audioSequence = [];
    this.currentAudioIndex = 0;
    this.audioElement = null;
    this.isPlaying = false;
    this.isSpeaking = false;
    this.pauseIntervalId = null;
    this.pauseTimeoutId = null;

    // Configurações
    this.settings = {
      musicEnabled: true,
      musicVolume: 0.15, // 15% durante pausas
      musicVolumeFaded: 0.05, // 5% durante fala (15% * 0.33)
      narrationVolume: 1.0, // 100%
      pauseDuration: 5, // 5 segundos
      fadeDuration: 500, // 500ms
    };

    // Músicas de fundo (seleção e narração)
    this.selectionMusic = null;
    this.narrationMusic = null;
    this.currentMusic = null;

    this.init();
    this.loadSettings();
    this.initSelectionMusic();
  }

  init() {
    this.renderPlayerSelector();
    this.renderRoles();
    this.updateTeamCounters();
  }

  // ===== RENDERIZAÇÃO =====
  renderPlayerSelector() {
    const container = document.getElementById("playerSelector");
    container.innerHTML = "";

    for (let i = 5; i <= 10; i++) {
      const btn = document.createElement("button");
      btn.className = `player-btn ${i === this.players ? "active" : ""}`;
      btn.textContent = i;
      btn.onclick = () => this.selectPlayers(i);
      container.appendChild(btn);
    }
  }

  renderRoles() {
    this.renderRoleGroup("goodRoles", [
      "loyalServant",
      "merlin",
      "percival",
      "lancelotGood",
    ]);
    this.renderRoleGroup("evilRoles", [
      "evilMinion",
      "assassin",
      "morgana",
      "lancelotEvil",
      "mordred",
      "oberon",
    ]);
  }

  renderRoleGroup(containerId, roleIds) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    roleIds.forEach((roleId) => {
      const role = ROLE_DEFINITIONS[roleId];
      const roleDiv = document.createElement("div");

      const isMandatory = role.mandatory;
      const isAuto = role.auto;
      const isLinked = !!role.linkedRole;

      // Para papéis automáticos, calcular a quantidade
      let count = 0;
      if (isAuto) {
        if (roleId === "loyalServant") {
          count = this.loyalServantCount();
        } else if (roleId === "evilMinion") {
          count = this.evilMinionCount();
        }
      }

      const isActive = this.roles[roleId] === true || count > 0;

      // Para personagens normais, verificar se pode adicionar
      let canAdd = false;
      let canRemove = false;

      if (!isAuto && !isMandatory) {
        canAdd = this.canToggleRole(roleId);
        canRemove = isActive;
      }

      const isDisabled = !isMandatory && !isAuto && !canAdd && !isActive;

      roleDiv.className = `role-item ${isActive ? "active" : ""} ${
        role.team === "evil" ? "evil" : ""
      } ${isMandatory ? "mandatory" : ""} ${isDisabled ? "disabled" : ""} ${
        isLinked ? "linked" : ""
      } ${isAuto ? "auto" : ""}`;

      if (isAuto) {
        // Papel automático - apenas exibe quantidade
        // Formato: "1 Servo de Arthur" ou "2 Servos de Arthur"
        const nameSingular =
          roleId === "loyalServant" ? "Servo de Arthur" : "Minion de Mordred";
        const namePlural =
          roleId === "loyalServant" ? "Servos de Arthur" : "Minions de Mordred";
        const displayName = count === 1 ? nameSingular : namePlural;

        roleDiv.innerHTML = `
                    <div class="role-header">
                        <span class="role-name">${role.icon} <span class="auto-count-number">${count}</span> ${displayName}</span>
                    </div>
                    <div class="role-description">${role.description}</div>
                `;
      } else {
        // Papel normal
        roleDiv.innerHTML = `
                    <div class="role-header">
                        <span class="role-name">${role.icon} ${role.name}</span>
                        ${
                          isMandatory
                            ? '<span style="color: #ffd700; font-size: 0.8em;">⭐ Obrigatório</span>'
                            : ""
                        }
                        ${
                          isLinked
                            ? '<span style="color: #4169e1; font-size: 0.8em;">🔗 Linkado</span>'
                            : ""
                        }
                    </div>
                    <div class="role-description">${role.description}</div>
                `;

        if (!isMandatory) {
          roleDiv.onclick = () => {
            if (isActive || canAdd) {
              this.toggleRole(roleId);
            }
          };
        }
      }

      container.appendChild(roleDiv);
    });
  }

  // ===== SELEÇÃO E VALIDAÇÃO =====
  selectPlayers(num) {
    this.players = num;

    // Validar se os personagens selecionados ainda cabem
    const maxGood = TEAM_DISTRIBUTION[this.players].good;
    const maxEvil = TEAM_DISTRIBUTION[this.players].evil;

    // Se exceder o limite do bem, desmarcar personagens opcionais até caber
    while (this.goodCount() > maxGood) {
      // Desmarcar personagens opcionais na ordem: Lancelot Bom, Percival
      if (this.roles.lancelotGood) {
        this.roles.lancelotGood = false;
        this.roles.lancelotEvil = false; // Linkado
      } else if (this.roles.percival) {
        this.roles.percival = false;
      } else {
        break; // Não tem mais o que desmarcar
      }
    }

    // Se exceder o limite do mal, desmarcar personagens opcionais até caber
    while (this.evilCount() > maxEvil) {
      // Desmarcar personagens opcionais na ordem: Lancelot Mal, Oberon, Mordred, Morgana
      if (this.roles.lancelotEvil) {
        this.roles.lancelotEvil = false;
        this.roles.lancelotGood = false; // Linkado
      } else if (this.roles.oberon) {
        this.roles.oberon = false;
      } else if (this.roles.mordred) {
        this.roles.mordred = false;
      } else if (this.roles.morgana) {
        this.roles.morgana = false;
      } else {
        break; // Não tem mais o que desmarcar
      }
    }

    // Atualizar interface
    this.updateTeamCounters();
    this.renderPlayerSelector();
    this.renderRoles();
  }

  canToggleRole(roleId) {
    const role = ROLE_DEFINITIONS[roleId];

    // Personagens obrigatórios não podem ser desativados
    if (role.mandatory) {
      return false;
    }

    // Personagens automáticos não podem ser editados
    if (role.auto) {
      return false;
    }

    // Se é um personagem linkado (Lancelot)
    if (role.linkedRole) {
      // Se já está ativo, pode desativar
      if (this.roles[roleId]) {
        return true;
      }

      // Se não está ativo, precisa verificar espaço para AMBOS
      const maxGood = TEAM_DISTRIBUTION[this.players].good;
      const maxEvil = TEAM_DISTRIBUTION[this.players].evil;
      const currentGood = this.goodCount();
      const currentEvil = this.evilCount();

      return currentGood < maxGood && currentEvil < maxEvil;
    }

    if (role.team === "good") {
      const maxGood = TEAM_DISTRIBUTION[this.players].good;
      const currentGood = this.goodCount();

      // Se o personagem está ativo, pode desativar
      if (this.roles[roleId]) {
        return true;
      }

      // Se não está ativo, só pode ativar se houver espaço
      return currentGood < maxGood;
    } else if (role.team === "evil") {
      const maxEvil = TEAM_DISTRIBUTION[this.players].evil;
      const currentEvil = this.evilCount();

      // Se o personagem está ativo, pode desativar
      if (this.roles[roleId]) {
        return true;
      }

      // Se não está ativo, só pode ativar se houver espaço
      return currentEvil < maxEvil;
    }

    return true;
  }

  toggleRole(roleId) {
    if (ROLE_DEFINITIONS[roleId].mandatory) return;

    const role = ROLE_DEFINITIONS[roleId];

    // Se é um Lancelot, precisa checar se pode ativar/desativar AMBOS
    if (role.linkedRole) {
      const linkedRoleId = role.linkedRole;

      // Se está ativando
      if (!this.roles[roleId]) {
        // Verificar se tem espaço para ambos
        const currentGood = this.goodCount();
        const currentEvil = this.evilCount();
        const maxGood = TEAM_DISTRIBUTION[this.players].good;
        const maxEvil = TEAM_DISTRIBUTION[this.players].evil;

        if (currentGood < maxGood && currentEvil < maxEvil) {
          this.roles[roleId] = true;
          this.roles[linkedRoleId] = true;
        }
      } else {
        // Se está desativando, desativa ambos
        this.roles[roleId] = false;
        this.roles[linkedRoleId] = false;
      }
    } else {
      // Personagem normal
      if (this.canToggleRole(roleId)) {
        this.roles[roleId] = !this.roles[roleId];
      }
    }

    this.updateTeamCounters();
    this.renderRoles();
  }

  incrementCounter(roleId) {
    const role = ROLE_DEFINITIONS[roleId];

    // Verificar se pode adicionar baseado no time
    let canAdd = false;
    if (role.team === "good") {
      const currentGood = this.goodCount();
      const maxGood = TEAM_DISTRIBUTION[this.players].good;
      canAdd = currentGood < maxGood;
    } else if (role.team === "evil") {
      const currentEvil = this.evilCount();
      const maxEvil = TEAM_DISTRIBUTION[this.players].evil;
      canAdd = currentEvil < maxEvil;
    }

    if (canAdd) {
      this.roles[roleId]++;
      this.updateTeamCounters();
      this.renderRoles();
    }
  }

  decrementCounter(roleId) {
    if (this.roles[roleId] > 0) {
      this.roles[roleId]--;
      this.updateTeamCounters();
      this.renderRoles();
    }
  }

  resetRoles() {
    this.roles = {
      merlin: true,
      assassin: true,
      percival: false,
      morgana: false,
      mordred: false,
      oberon: false,
      lancelotGood: false,
      lancelotEvil: false,
    };
    this.updateTeamCounters();
    this.renderRoles();
  }

  goodCount() {
    let count = 0;
    if (this.roles.merlin) count++;
    if (this.roles.percival) count++;
    if (this.roles.lancelotGood) count++;
    return count;
  }

  loyalServantCount() {
    const maxGood = TEAM_DISTRIBUTION[this.players].good;
    return maxGood - this.goodCount();
  }

  evilCount() {
    let count = 0;
    if (this.roles.assassin) count++;
    if (this.roles.morgana) count++;
    if (this.roles.mordred) count++;
    if (this.roles.oberon) count++;
    if (this.roles.lancelotEvil) count++;
    return count;
  }

  evilMinionCount() {
    const maxEvil = TEAM_DISTRIBUTION[this.players].evil;
    return maxEvil - this.evilCount();
  }

  totalGoodCount() {
    return TEAM_DISTRIBUTION[this.players].good;
  }

  totalEvilCount() {
    return TEAM_DISTRIBUTION[this.players].evil;
  }

  isTeamComplete() {
    // Sempre completo, pois servos/minions preenchem automaticamente
    return true;
  }

  updateTeamCounters() {
    const totalGood = this.totalGoodCount();
    const totalEvil = this.totalEvilCount();

    // Atualizar títulos das seções
    document.getElementById(
      "goodRolesTitle"
    ).innerHTML = `⚔️ Forças do Bem <span style="color: #ffe396;">→</span> <span style="color: white;">${totalGood} Personagens</span>`;
    document.getElementById(
      "evilRolesTitle"
    ).innerHTML = `🗡️ Forças do Mal <span style="color: #ffe396;">→</span> <span style="color: white;">${totalEvil} Personagens</span>`;

    // Sempre habilitar botão de iniciar (times sempre completos)
    const startBtn = document.getElementById("startBtn");
    startBtn.disabled = false;
  }

  // ===== GERAÇÃO DE SEQUÊNCIA DE ÁUDIOS =====
  generateAudioSequence() {
    const sequence = [];
    const hasLancelots = this.roles.lancelotGood || this.roles.lancelotEvil;

    // 1. Introdução
    sequence.push("1");

    // 2. Preparação
    sequence.push("2");

    // 3. Servos do mal levantam polegar
    if (hasLancelots) {
      sequence.push("3-lancelot");
    } else {
      sequence.push("3");
    }

    // 4. Servos se reconhecem
    if (this.roles.oberon && hasLancelots) {
      sequence.push("4-oberon-lancelot");
    } else if (this.roles.oberon) {
      sequence.push("4-oberon");
    } else if (hasLancelots) {
      sequence.push("4-lancelot");
    } else {
      sequence.push("4");
    }

    // 5. Fecham olhos (e Lancelot mal e/ou Mordred abaixam polegar)
    if (this.roles.mordred && hasLancelots) {
      sequence.push("5-mordred-lancelot");
    } else if (this.roles.mordred) {
      sequence.push("5-mordred");
    } else if (hasLancelots) {
      sequence.push("5-lancelot");
    } else {
      sequence.push("5");
    }

    // 6. Merlin abre os olhos
    sequence.push("6");

    // 7. Merlin fecha os olhos
    sequence.push("7");

    // 8-10. Percival (se estiver no jogo)
    if (this.roles.percival) {
      // 8. Merlin (e Morgana) levantam polegar
      if (this.roles.morgana) {
        sequence.push("8-morgana");
      } else {
        sequence.push("8");
      }

      // 9. Percival vê
      if (this.roles.morgana) {
        sequence.push("9-morgana");
      } else {
        sequence.push("9");
      }

      // 10. Percival fecha olhos
      sequence.push("10");
    }

    // 11-12. Lancelots se reconhecem (apenas se 8+ jogadores)
    if (hasLancelots && this.players >= 8) {
      sequence.push("11");
      sequence.push("12");
    }

    // 13. Todos abrem os olhos
    sequence.push("13");

    // 14. Início do jogo
    sequence.push("14");

    return sequence;
  }

  // ===== CONTROLE DE NARRAÇÃO =====
  startNarration() {
    this.audioSequence = this.generateAudioSequence();
    this.currentAudioIndex = 0;

    // Parar música de seleção e iniciar música de narração
    if (this.selectionMusic) {
      this.selectionMusic.pause();
      this.selectionMusic.currentTime = 0;
    }
    this.initNarrationMusic();

    // Esconder título e interface de configuração
    document.querySelector(".game-title").style.display = "none";

    // Esconder botões flutuantes durante a narração
    const floatingButtons = document.querySelector(".floating-buttons");
    if (floatingButtons) {
      floatingButtons.style.display = "none";
    }

    document
      .querySelectorAll(".section, .action-buttons")
      .forEach((el) => (el.style.display = "none"));
    document.getElementById("audioPlayer").style.display = "block";

    // Esconder botão de config da narração (só aparece quando pausado)
    document.getElementById("settingsBtnNarration").style.display = "none";

    // Iniciar primeiro áudio
    this.playCurrentAudio();
  }

  playCurrentAudio() {
    if (this.currentAudioIndex >= this.audioSequence.length) {
      this.stopNarration();
      return;
    }

    const audioFile = this.audioSequence[this.currentAudioIndex];
    const audioPath = `${AUDIO_BASE_PATH}${audioFile}.mp3`;

    console.log(
      `[AVALON] Tocando áudio ${this.currentAudioIndex + 1}/${
        this.audioSequence.length
      }: ${audioPath}`
    );

    // Atualizar UI
    this.updateAudioInfo();

    // Parar contador de pausa se estiver rodando
    this.stopPauseCounter();

    // Criar e tocar áudio
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }

    this.audioElement = new Audio(audioPath);
    this.audioElement.volume = this.settings.narrationVolume;

    console.log(`[AVALON] Volume narração: ${this.settings.narrationVolume}`);

    // Fade música para 10% antes de iniciar narração
    this.isSpeaking = true;
    this.fadeMusic(this.settings.musicVolumeFaded);

    this.audioElement.addEventListener("ended", () => {
      console.log("[AVALON] Áudio terminou");

      // Fade música de volta para 30%
      this.isSpeaking = false;
      this.fadeMusic(this.settings.musicVolume);

      // Verificar se precisa de pausa
      if (this.shouldPauseAfterAudio(audioFile)) {
        console.log(`[AVALON] Pausando por ${this.settings.pauseDuration}s`);

        // Aplicar pausa configurada com contador visual
        this.startPauseCounter(this.settings.pauseDuration);

        this.pauseTimeoutId = setTimeout(() => {
          this.nextAudio();
        }, this.settings.pauseDuration * 1000);
      } else {
        console.log("[AVALON] Sem pausa, próximo áudio");
        // Ir direto para próximo (áudios 1, 13, 14)
        this.nextAudio();
      }
    });

    this.audioElement.addEventListener("error", (e) => {
      console.error(`[AVALON] Erro ao carregar áudio: ${audioPath}`, e);
      alert(
        `Erro ao carregar o áudio ${audioFile}.mp3. Verifique se o arquivo existe na pasta "audios/".`
      );
    });

    this.audioElement.addEventListener("loadeddata", () => {
      console.log(
        "[AVALON] Áudio carregado, duração:",
        this.audioElement.duration,
        "s"
      );
    });

    // Tentar reproduzir
    const playPromise = this.audioElement.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("[AVALON] Áudio reproduzindo com sucesso");
          this.isPlaying = true;
          this.updatePlayPauseButton();
        })
        .catch((e) => {
          console.error("[AVALON] Erro ao reproduzir áudio:", e);
          alert("Erro ao reproduzir áudio. Detalhes no console.");
          this.isPlaying = false;
          this.updatePlayPauseButton();
        });
    } else {
      this.isPlaying = true;
      this.updatePlayPauseButton();
    }
  }

  togglePlayPause() {
    console.log(
      "[AVALON] togglePlayPause chamado, isPlaying:",
      this.isPlaying,
      "audioElement:",
      !!this.audioElement
    );

    if (!this.audioElement) {
      console.error("[AVALON] audioElement não existe!");
      return;
    }

    if (this.isPlaying) {
      // PAUSAR
      console.log("[AVALON] Pausando...");
      this.audioElement.pause();
      if (this.currentMusic) {
        this.currentMusic.pause();
      }
      this.isPlaying = false;

      // Parar contador se estiver rodando
      this.stopPauseCounter();

      // Mostrar botão de configurações quando pausado
      document.getElementById("settingsBtnNarration").style.display = "block";
    } else {
      // PLAY (continuar)
      console.log("[AVALON] Retomando...");
      this.audioElement.play().catch((e) => {
        console.error("[AVALON] Erro ao retomar áudio:", e);
      });
      if (this.currentMusic && this.settings.musicEnabled) {
        this.currentMusic.play().catch((e) => {
          console.error("[AVALON] Erro ao retomar música:", e);
        });
      }
      this.isPlaying = true;

      // Esconder botão de configurações quando tocando
      document.getElementById("settingsBtnNarration").style.display = "none";
    }

    this.updatePlayPauseButton();
    console.log("[AVALON] Novo estado isPlaying:", this.isPlaying);
  }

  nextAudio() {
    this.currentAudioIndex++;

    if (this.currentAudioIndex < this.audioSequence.length) {
      this.playCurrentAudio();
    } else {
      this.stopNarration();
    }
  }

  previousAudio() {
    if (this.currentAudioIndex > 0) {
      this.currentAudioIndex--;
      this.playCurrentAudio();
    }
  }

  stopNarration() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }

    // Parar música de narração e voltar para música de seleção
    if (this.narrationMusic) {
      this.narrationMusic.pause();
      this.narrationMusic.currentTime = 0;
      this.narrationMusic = null;
    }

    // Reiniciar música de seleção
    if (this.selectionMusic && this.settings.musicEnabled) {
      this.currentMusic = this.selectionMusic;
      this.selectionMusic.volume = this.settings.musicVolume;
      this.selectionMusic.play().catch((e) => {});
    }

    // Parar contadores
    this.stopPauseCounter();

    this.isPlaying = false;
    this.isSpeaking = false;
    this.audioSequence = [];
    this.currentAudioIndex = 0;

    // Mostrar título e interface de configuração novamente
    document.querySelector(".game-title").style.display = "block";

    // Mostrar botões flutuantes novamente
    const floatingButtons = document.querySelector(".floating-buttons");
    if (floatingButtons) {
      floatingButtons.style.display = "flex";
    }

    document
      .querySelectorAll(".section, .action-buttons")
      .forEach((el) => (el.style.display = "block"));
    document.getElementById("audioPlayer").style.display = "none";
  }

  updateAudioInfo() {
    const audioFile = this.audioSequence[this.currentAudioIndex];
    const stepText = `Etapa ${this.currentAudioIndex + 1} de ${
      this.audioSequence.length
    }`;
    const audioText = AUDIO_DESCRIPTIONS[audioFile] || "Reproduzindo...";

    document.getElementById("audioStep").textContent = stepText;
    document.getElementById("audioText").textContent = audioText;

    // Atualizar botões de navegação
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn) {
      prevBtn.disabled = this.currentAudioIndex === 0;
    }

    if (nextBtn) {
      nextBtn.disabled =
        this.currentAudioIndex === this.audioSequence.length - 1;
    }

    console.log(
      `[AVALON] Botões - Prev: ${
        prevBtn
          ? prevBtn.disabled
            ? "desabilitado"
            : "habilitado"
          : "não encontrado"
      }, Next: ${
        nextBtn
          ? nextBtn.disabled
            ? "desabilitado"
            : "habilitado"
          : "não encontrado"
      }`
    );
  }

  updatePlayPauseButton() {
    const btn = document.getElementById("playPauseBtn");
    const icon = btn.querySelector("i");

    if (this.isPlaying) {
      icon.className = "fas fa-pause";
    } else {
      icon.className = "fas fa-play";
    }
  }

  // ===== CONFIGURAÇÕES E MÚSICA =====

  loadSettings() {
    const saved = localStorage.getItem("avalonSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      this.settings = { ...this.settings, ...settings };

      // Garantir que volume narração esteja entre 50-150%
      if (this.settings.narrationVolume < 0.5) {
        this.settings.narrationVolume = 0.5;
      }
    }

    // Aplicar valores nos controles inline
    if (document.getElementById("narrationVolumeQuick")) {
      const volumePercent = Math.round(this.settings.narrationVolume * 100);
      document.getElementById("narrationVolumeQuick").value = volumePercent;
      document.getElementById("volumeDisplayQuick").textContent =
        volumePercent + "%";
    }

    // Aplicar estado do botão de música
    if (document.getElementById("musicToggle")) {
      const btn = document.getElementById("musicToggle");
      if (this.settings.musicEnabled) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
  }

  saveSettings() {
    // Pegar valores do modal
    const musicBtn = document.getElementById("musicToggleModal");
    this.settings.musicEnabled = musicBtn.classList.contains("active");
    this.settings.musicVolume =
      document.getElementById("musicVolumeSetting").value / 100;
    this.settings.narrationVolume =
      document.getElementById("narrationVolumeSetting").value / 100;
    this.settings.pauseDuration = parseInt(
      document.getElementById("pauseDurationSetting").value
    );
    this.settings.musicVolumeFaded = this.settings.musicVolume * 0.33; // 10% relativo

    // Aplicar imediatamente na música atual
    if (this.currentMusic) {
      this.currentMusic.volume = this.isSpeaking
        ? this.settings.musicVolumeFaded
        : this.settings.musicVolume;
    }

    if (this.audioElement) {
      this.audioElement.volume = this.settings.narrationVolume;
    }

    // Sincronizar controles inline
    const volumePercent = Math.round(this.settings.narrationVolume * 100);
    document.getElementById("narrationVolumeQuick").value = volumePercent;
    document.getElementById("volumeDisplayQuick").textContent =
      volumePercent + "%";

    const musicBtnInline = document.getElementById("musicToggle");
    if (this.settings.musicEnabled) {
      musicBtnInline.classList.add("active");
      musicBtnInline.querySelector("i").className = "fas fa-music";
      if (this.currentMusic) this.currentMusic.play().catch((e) => {});
    } else {
      musicBtnInline.classList.remove("active");
      musicBtnInline.querySelector("i").className = "fas fa-music-slash";
      if (this.currentMusic) this.currentMusic.pause();
    }

    // Persistir
    localStorage.setItem("avalonSettings", JSON.stringify(this.settings));

    this.closeSettings();
  }

  openSettings() {
    // Sincronizar valores do modal com settings atuais
    const musicBtn = document.getElementById("musicToggleModal");
    if (this.settings.musicEnabled) {
      musicBtn.classList.add("active");
      musicBtn.querySelector("i").className = "fas fa-music";
    } else {
      musicBtn.classList.remove("active");
      musicBtn.querySelector("i").className = "fas fa-music-slash";
    }

    document.getElementById("musicVolumeSetting").value =
      this.settings.musicVolume * 100;
    document.getElementById("musicVolumeDisplay").textContent =
      Math.round(this.settings.musicVolume * 100) + "%";
    document.getElementById("narrationVolumeSetting").value =
      this.settings.narrationVolume * 100;
    document.getElementById("narrationVolumeDisplay").textContent =
      Math.round(this.settings.narrationVolume * 100) + "%";
    document.getElementById("pauseDurationSetting").value =
      this.settings.pauseDuration;
    document.getElementById("pauseDurationDisplay").textContent =
      this.settings.pauseDuration + "s";

    document.getElementById("settingsModal").style.display = "flex";
  }

  closeSettings() {
    document.getElementById("settingsModal").style.display = "none";
  }

  updateSettingPreview() {
    // Atualizar displays dos sliders em tempo real
    const musicVol = document.getElementById("musicVolumeSetting").value;
    document.getElementById("musicVolumeDisplay").textContent = musicVol + "%";

    // Aplicar volume na música em tempo real
    if (this.currentMusic) {
      const volume = musicVol / 100;
      this.currentMusic.volume = this.isSpeaking ? volume * 0.33 : volume;
    }

    const narrationVol = document.getElementById(
      "narrationVolumeSetting"
    ).value;
    document.getElementById("narrationVolumeDisplay").textContent =
      narrationVol + "%";

    const pause = document.getElementById("pauseDurationSetting").value;
    document.getElementById("pauseDurationDisplay").textContent = pause + "s";
  }

  toggleMusicFromModal() {
    const btn = document.getElementById("musicToggleModal");
    const icon = btn.querySelector("i");

    if (btn.classList.contains("active")) {
      // Desligar
      btn.classList.remove("active");
      icon.className = "fas fa-music-slash";
    } else {
      // Ligar
      btn.classList.add("active");
      icon.className = "fas fa-music";
    }
  }

  resetSettings() {
    // Restaurar valores padrão
    this.settings = {
      musicEnabled: true,
      musicVolume: 0.3,
      musicVolumeFaded: 0.1,
      narrationVolume: 1.0,
      pauseDuration: 5,
      fadeDuration: 500,
    };

    // Atualizar modal
    const musicBtn = document.getElementById("musicToggleModal");
    musicBtn.classList.add("active");
    musicBtn.querySelector("i").className = "fas fa-music";

    document.getElementById("musicVolumeSetting").value = 30;
    document.getElementById("musicVolumeDisplay").textContent = "30%";
    document.getElementById("narrationVolumeSetting").value = 100;
    document.getElementById("narrationVolumeDisplay").textContent = "100%";
    document.getElementById("pauseDurationSetting").value = 5;
    document.getElementById("pauseDurationDisplay").textContent = "5s";

    // Salvar e aplicar
    this.saveSettings();
  }

  resetSettingsPreview() {
    // Apenas atualiza valores no modal SEM persistir
    const musicBtn = document.getElementById("musicToggleModal");
    musicBtn.classList.add("active");
    musicBtn.querySelector("i").className = "fas fa-music";

    document.getElementById("musicVolumeSetting").value = 15;
    document.getElementById("musicVolumeDisplay").textContent = "15%";
    document.getElementById("narrationVolumeSetting").value = 100;
    document.getElementById("narrationVolumeDisplay").textContent = "100%";
    document.getElementById("pauseDurationSetting").value = 5;
    document.getElementById("pauseDurationDisplay").textContent = "5s";

    // NÃO fecha modal e NÃO salva
    // Usuário precisa clicar em "Salvar" para efetivar
  }

  initSelectionMusic() {
    console.log("[AVALON] Iniciando música de seleção...");

    // Música da tela de seleção
    this.selectionMusic = new Audio(
      "src/assets/audios/background-selection.mp3"
    );
    this.selectionMusic.loop = true;
    this.selectionMusic.volume = this.settings.musicVolume;
    this.currentMusic = this.selectionMusic;

    // Configurar para autoplay
    this.selectionMusic.autoplay = true;

    // Tentar iniciar automaticamente
    if (this.settings.musicEnabled) {
      // Estratégia 1: Tentar imediatamente
      this.selectionMusic
        .play()
        .then(() => {
          console.log(
            "[AVALON] ✓ Música de seleção iniciada com sucesso imediatamente"
          );
        })
        .catch((e) => {
          console.log(
            "[AVALON] ⚠️ Tentativa imediata falhou, aguardando interação..."
          );

          // Estratégia 2: Tentar em múltiplos eventos
          const events = [
            "click",
            "touchstart",
            "keydown",
            "mousedown",
            "touchend",
            "mousemove",
          ];

          const startOnInteraction = () => {
            console.log(
              "[AVALON] 🎵 Tentando iniciar música após interação..."
            );
            this.selectionMusic
              .play()
              .then(() => {
                console.log(
                  "[AVALON] ✓ Música iniciada após interação do usuário"
                );
                // Remover todos os listeners
                events.forEach((evt) => {
                  document.removeEventListener(evt, startOnInteraction);
                  document.body.removeEventListener(evt, startOnInteraction);
                });
              })
              .catch((err) => {
                console.error("[AVALON] ✗ Erro ao iniciar música:", err);
              });
          };

          // Adicionar listeners tanto no document quanto no body
          events.forEach((evt) => {
            document.addEventListener(evt, startOnInteraction, {
              once: true,
              capture: true,
            });
            document.body.addEventListener(evt, startOnInteraction, {
              once: true,
              capture: true,
            });
          });

          // Estratégia 3: Tentar novamente após um pequeno delay
          setTimeout(() => {
            if (this.selectionMusic.paused) {
              console.log("[AVALON] 🔄 Tentando iniciar música após 500ms...");
              this.selectionMusic.play().catch(() => {
                console.log(
                  "[AVALON] ⚠️ Ainda aguardando interação do usuário"
                );
              });
            }
          }, 500);

          // Estratégia 4: Tentar quando a página estiver completamente carregada
          if (document.readyState === "loading") {
            window.addEventListener("load", () => {
              if (this.selectionMusic.paused) {
                console.log(
                  "[AVALON] 🔄 Tentando iniciar música após page load..."
                );
                this.selectionMusic.play().catch(() => {});
              }
            });
          }
        });
    }
  }

  initNarrationMusic() {
    // Música da narração
    this.narrationMusic = new Audio(
      "src/assets/audios/background-narration.mp3"
    );
    this.narrationMusic.loop = true;
    this.narrationMusic.volume = this.settings.musicVolume;
    this.currentMusic = this.narrationMusic;

    if (this.settings.musicEnabled) {
      this.narrationMusic.play().catch((e) => {
        console.log("Erro ao iniciar música de narração:", e);
      });
    }
  }

  startPauseCounter(seconds) {
    const counterDiv = document.getElementById("pauseCounter");
    const secondsSpan = document.getElementById("pauseSeconds");

    counterDiv.classList.add("active");

    let remainingSeconds = seconds;
    secondsSpan.textContent = remainingSeconds;

    this.pauseIntervalId = setInterval(() => {
      remainingSeconds--;
      secondsSpan.textContent = remainingSeconds;

      if (remainingSeconds <= 0) {
        clearInterval(this.pauseIntervalId);
        counterDiv.classList.remove("active");
      }
    }, 1000);
  }

  stopPauseCounter() {
    if (this.pauseIntervalId) {
      clearInterval(this.pauseIntervalId);
      this.pauseIntervalId = null;
    }
    if (this.pauseTimeoutId) {
      clearTimeout(this.pauseTimeoutId);
      this.pauseTimeoutId = null;
    }
    const counterDiv = document.getElementById("pauseCounter");
    if (counterDiv) {
      counterDiv.classList.remove("active");
    }
  }

  toggleMusic() {
    this.settings.musicEnabled = !this.settings.musicEnabled;
    const btn = document.getElementById("musicToggle");
    const icon = btn.querySelector("i");

    if (this.settings.musicEnabled) {
      // LIGADO
      btn.classList.add("active");
      icon.className = "fas fa-music";
      if (this.currentMusic) {
        this.currentMusic.play().catch((e) => console.log("Música:", e));
      }
    } else {
      // DESLIGADO
      btn.classList.remove("active");
      icon.className = "fas fa-music-slash";
      if (this.currentMusic) {
        this.currentMusic.pause();
      }
    }

    // Salvar preferência
    localStorage.setItem("avalonSettings", JSON.stringify(this.settings));
  }

  updateNarrationVolumeQuick(value) {
    // Garantir range 50-150%
    const numValue = parseInt(value);
    if (numValue < 50) value = 50;
    if (numValue > 150) value = 150;

    this.settings.narrationVolume = value / 100;
    document.getElementById("volumeDisplayQuick").textContent = value + "%";

    if (this.audioElement) {
      this.audioElement.volume = this.settings.narrationVolume;
    }

    // Salvar preferência
    localStorage.setItem("avalonSettings", JSON.stringify(this.settings));
  }

  fadeMusic(targetVolume, duration = null) {
    if (!this.currentMusic) return;

    const fadeTime = duration || this.settings.fadeDuration;
    const music = this.currentMusic;
    const startVolume = music.volume;
    const startTime = Date.now();

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeTime, 1);

      // Interpolação suave
      music.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress < 1) {
        requestAnimationFrame(fade);
      }
    };

    fade();
  }

  shouldPauseAfterAudio(audioFile) {
    // Áudios sem pausa: 1 (introdução), 13 (todos abrem), 14 (encerramento)
    const noPauseAudios = ["1", "13", "14"];

    // Extrair número base do arquivo (ex: "3-lancelot" → "3")
    const baseAudio = audioFile.split("-")[0];

    // Se está na lista de "sem pausa", retorna false
    return !noPauseAudios.includes(baseAudio);
  }
}

// ===== INICIALIZAÇÃO =====
const app = new AvalonApp();
