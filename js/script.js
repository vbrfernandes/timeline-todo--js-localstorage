/* ============================================================
   ESTADO E VARIÁVEIS GLOBAIS
   ============================================================ */
let tarefas = JSON.parse(localStorage.getItem("planner_tasks")) || [];
let posicaoCarrossel = 0;

const themes = ["default", "terracota", "industrial", "forest", "solar"];
let currentThemeIndex = 0;

/* ============================================================
   LÓGICA PRINCIPAL (CRUD E DADOS)
   ============================================================ */

function salvarEAtualizar() {
  localStorage.setItem("planner_tasks", JSON.stringify(tarefas));
  renderizarTarefas();
  atualizarEstatisticas();
  renderizarConcluidos();
}

function adicionarNovaTarefa() {
  const inputTexto = document.getElementById("todo-input");
  const inputData = document.getElementById("todo-date");
  const inputRepeticao = document.getElementById("todo-repeat");
  const inputLimite = document.getElementById("repeat-limit");

  if (inputTexto.value === "" || inputData.value === "") {
    alert("Preencha a tarefa e a data!");
    return;
  }

  const tipoRepeticao = inputRepeticao.value;
  const quantidade =
    tipoRepeticao === "none" ? 1 : parseInt(inputLimite.value) || 1;
  let dataCorrenteStr = inputData.value;

  for (let i = 0; i < quantidade; i++) {
    const novaTarefa = {
      id: Date.now() + i,
      texto: inputTexto.value,
      data: dataCorrenteStr,
      concluida: false,
      subtarefas: [],
      expandida: false,
      repeticao: tipoRepeticao,
    };

    tarefas.push(novaTarefa);

    if (tipoRepeticao !== "none") {
      dataCorrenteStr = calcularProximaData(dataCorrenteStr, tipoRepeticao);
    }
  }

  // Resetar inputs
  inputTexto.value = "";
  inputRepeticao.value = "none";
  toggleLimitInput();

  salvarEAtualizar();
}

function editarTarefa(id) {
  const tarefa = tarefas.find((t) => t.id === id);
  if (!tarefa) return;

  const novoTexto = prompt("Edite sua tarefa:", tarefa.texto);

  if (novoTexto !== null && novoTexto.trim() !== "") {
    tarefas = tarefas.map((t) => {
      if (t.id === id) return { ...t, texto: novoTexto.trim() };
      return t;
    });
    salvarEAtualizar();
  }
}

function concluirTarefa(id) {
  tarefas = tarefas.map((t) => (t.id === id ? { ...t, concluida: true } : t));
  salvarEAtualizar();
}

function excluirTarefa(id) {
  if (confirm("Deseja excluir esta tarefa permanentemente?")) {
    tarefas = tarefas.filter((t) => t.id !== id);
    salvarEAtualizar();
  }
}

function limparCarrossel() {
  const temTarefasPendentes = tarefas.some((t) => !t.concluida);

  if (!temTarefasPendentes) {
    alert("O carrossel já está vazio!");
    return;
  }

  const confirmacao = confirm(
    "⚠️ Tem certeza que deseja limpar todas as tarefas DO CARROSSEL (pendentes)?\n\nAs tarefas já concluídas serão mantidas no histórico.",
  );

  if (confirmacao) {
    tarefas = tarefas.filter((tarefa) => tarefa.concluida === true);
    salvarEAtualizar();
  }
}

function limparConcluidos() {
  if (
    confirm(
      "Deseja apagar permanentemente todo o histórico de tarefas concluídas?",
    )
  ) {
    tarefas = tarefas.filter((t) => !t.concluida);
    salvarEAtualizar();
    closeModal();
  }
}

/* ============================================================
   LÓGICA DE SUBTAREFAS
   ============================================================ */

function adicionarSubtarefa(idTarefa) {
  const texto = prompt("O que precisa ser feito dentro desta tarefa?");
  if (!texto) return;

  tarefas = tarefas.map((t) => {
    if (t.id === idTarefa) {
      t.subtarefas.push({ texto: texto, concluida: false });
    }
    return t;
  });
  salvarEAtualizar();
}

function alternarSubtarefa(idTarefa, indexSub) {
  tarefas = tarefas.map((t) => {
    if (t.id === idTarefa) {
      t.subtarefas[indexSub].concluida = !t.subtarefas[indexSub].concluida;
    }
    return t;
  });
  salvarEAtualizar();
}

/* ============================================================
   RENDERIZAÇÃO (HTML GENERATION)
   ============================================================ */

function renderizarTarefas() {
  const container = document.getElementById("dynamic-timeline");
  container.innerHTML = "";

  const tarefasAtivas = tarefas.filter((t) => !t.concluida);
  const gruposPorData = {};

  tarefasAtivas.forEach((t) => {
    if (!gruposPorData[t.data]) gruposPorData[t.data] = [];
    gruposPorData[t.data].push(t);
  });

  Object.keys(gruposPorData)
    .sort()
    .forEach((dataStr) => {
      const coluna = document.createElement("div");
      coluna.className = "day-column glass";
      const dataFormatada = new Date(dataStr + "T00:00:00").toLocaleDateString(
        "pt-BR",
      );

      coluna.innerHTML = `
            <h3>${dataFormatada} <span>${gruposPorData[dataStr].length}</span></h3>
            <div class="task-list">
                ${gruposPorData[dataStr].map((t) => criarHtmlTarefa(t)).join("")}
            </div>
        `;
      container.appendChild(coluna);
    });

  setTimeout(() => {
    configurarAutoScroll();
  }, 10);
}

function criarHtmlTarefa(tarefa) {
  const prontas = tarefa.subtarefas.filter((s) => s.concluida).length;
  const total = tarefa.subtarefas.length;

  return `
        <div class="todo-item ${tarefa.expandida ? "expanded" : ""}" onclick="alternarExpansao(${tarefa.id})">
            <div class="task-main-info">
                <span class="task-text"><b class="b" >${tarefa.texto}</b></span>
                <div class="item-actions">
                    <button onclick="event.stopPropagation(); adicionarSubtarefa(${tarefa.id})" title="Add Subtarefa"><i class="fas fa-plus-circle"></i></button>
                    <button onclick="event.stopPropagation(); editarTarefa(${tarefa.id})" title="Editar"><i class="fas fa-pen-to-square"></i></button>
                    <button onclick="event.stopPropagation(); concluirTarefa(${tarefa.id})" title="Concluir"><i class="fas fa-check-circle"></i></button>
                    <button onclick="event.stopPropagation(); excluirTarefa(${tarefa.id})" title="Excluir"><i class="fas fa-trash-can"></i></button>
                </div>
            </div>
            
            ${total > 0 ? `<small class="sub-progress">${prontas}/${total} sub-itens</small>` : ""}
            
            <ul class="subtask-list">
                ${tarefa.subtarefas
                  .map(
                    (sub, index) => `
                    <li class="${sub.concluida ? "sub-done" : ""}" onclick="event.stopPropagation(); alternarSubtarefa(${tarefa.id}, ${index})">
                        <i class="fa-regular ${sub.concluida ? "fa-square-check" : "fa-square"}"></i>
                        ${sub.texto}
                    </li>
                `,
                  )
                  .join("")}
            </ul>
        </div>
    `;
}

function renderizarConcluidos() {
  const lista = document.getElementById("completed-list-full");
  lista.innerHTML = tarefas
    .filter((t) => t.concluida)
    .map(
      (t) => `
        <li>
            <span>${t.texto}</span>
            <small>${new Date(t.data + "T00:00:00").toLocaleDateString("pt-BR")}</small>
        </li>
    `,
    )
    .join("");
}

function atualizarEstatisticas() {
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const percentual = total === 0 ? 0 : Math.round((concluidas / total) * 100);

  document.getElementById("completed-count").textContent =
    `${concluidas}/${total} tarefas`;
  const circulo = document.getElementById("main-progress");
  circulo.style.background = `conic-gradient(var(--primary) ${percentual}%, #27272a 0%)`;
  circulo.querySelector(".inner-circle").textContent = `${percentual}%`;
}

function atualizarRelogio() {
  const agora = new Date();
  const opcoesData = { weekday: "long", day: "numeric", month: "long" };

  document.getElementById("current-date").textContent = agora
    .toLocaleDateString("pt-BR", opcoesData)
    .toUpperCase();
  document.getElementById("current-time").textContent =
    agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

/* ============================================================
   UI, CARROSSEL E HELPERS
   ============================================================ */

function moveCarousel(direcao) {
  const trilho = document.getElementById("dynamic-timeline");
  const larguraCard = 300; // 280px largura + 20px gap
  const maxScroll = (trilho.children.length - 1) * larguraCard;

  posicaoCarrossel -= direcao * larguraCard;

  if (posicaoCarrossel > 0) posicaoCarrossel = 0;
  if (Math.abs(posicaoCarrossel) > maxScroll) posicaoCarrossel = -maxScroll;

  trilho.style.transform = `translateX(${posicaoCarrossel}px)`;
}

function configurarAutoScroll() {
  document.querySelectorAll(".day-column").forEach((coluna) => {
    const lista = coluna.querySelector(".task-list");
    if (!lista) return;

    let speed = 0;
    let rafId = null;

    function loop() {
      if (speed !== 0) {
        lista.scrollTop += speed;
        rafId = requestAnimationFrame(loop);
      }
    }

    coluna.addEventListener("mouseenter", () => {
      if (!rafId) rafId = requestAnimationFrame(loop);
    });

    coluna.addEventListener("mousemove", (e) => {
      const rect = coluna.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const zone = rect.height * 0.4;
      const maxSpeed = 8;

      if (y < zone) {
        const intensity = (zone - y) / zone;
        speed = -Math.ceil(intensity * maxSpeed);
      } else if (y > rect.height - zone) {
        const intensity = (y - (rect.height - zone)) / zone;
        speed = Math.ceil(intensity * maxSpeed);
      } else {
        speed = 0;
      }
    });

    coluna.addEventListener("mouseleave", () => {
      speed = 0;
      cancelAnimationFrame(rafId);
      rafId = null;
    });
  });
}

function alternarExpansao(id) {
  tarefas = tarefas.map((t) => {
    if (t.id === id) return { ...t, expandida: !t.expandida };
    return t;
  });
  salvarEAtualizar();
}

function calcularProximaData(dataAtualStr, tipoRepeticao) {
  const [ano, mes, dia] = dataAtualStr.split("-").map(Number);
  const dataObj = new Date(ano, mes - 1, dia);

  switch (tipoRepeticao) {
    case "daily":
      dataObj.setDate(dataObj.getDate() + 1);
      break;
    case "weekly":
      dataObj.setDate(dataObj.getDate() + 7);
      break;
    case "monthly":
      dataObj.setMonth(dataObj.getMonth() + 1);
      break;
  }

  const anoNovo = dataObj.getFullYear();
  const mesNovo = String(dataObj.getMonth() + 1).padStart(2, "0");
  const diaNovo = String(dataObj.getDate()).padStart(2, "0");

  return `${anoNovo}-${mesNovo}-${diaNovo}`;
}

function toggleLimitInput() {
  const select = document.getElementById("todo-repeat");
  const wrapper = document.getElementById("limit-wrapper");

  if (select.value === "none") {
    wrapper.style.display = "none";
    document.getElementById("repeat-limit").value = "1";
  } else {
    wrapper.style.display = "block";
  }
}

// Modal Controls
function openModal() {
  document.getElementById("modal-completed").style.display = "flex";
}
function closeModal() {
  document.getElementById("modal-completed").style.display = "none";
}

/* ============================================================
   TEMA E CONFIGURAÇÕES VISUAIS
   ============================================================ */

function alternarTema() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const newTheme = themes[currentThemeIndex];

  const body = document.body;
  if (newTheme === "default") {
    body.removeAttribute("data-theme");
  } else {
    body.setAttribute("data-theme", newTheme);
  }

  localStorage.setItem("theme", newTheme);
}

function carregarTemaSalvo() {
  const savedTheme = localStorage.getItem("theme");
  const body = document.body;
  if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
    currentThemeIndex = themes.indexOf(savedTheme);
  }
}

/* ============================================================
   EVENT LISTENERS & INICIALIZAÇÃO
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Event Listeners
  document.getElementById("add-btn").onclick = adicionarNovaTarefa;
  document.getElementById("clear-all-btn").onclick = limparCarrossel;
  document
    .getElementById("theme-toggle")
    .addEventListener("click", alternarTema);

  // Inicialização
  carregarTemaSalvo();
  setInterval(atualizarRelogio, 1000);
  atualizarRelogio();
  salvarEAtualizar();
});
