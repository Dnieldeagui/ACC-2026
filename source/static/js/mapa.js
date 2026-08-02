/**
 * mapa.js — Sistema Gamificado de Aprendizado
 * Gerencia lições, XP, progresso, modal, confete e localStorage   INCOMPLETO
 */

// ============================================================
// DADOS DAS LIÇÕES
// ============================================================
const LICOES = [
    // MÓDULO 1 — Fundamentos
    {
        id: 1, titulo: "Vogais", icone: "🅰️",
        xp: 15, nivel: "Básico", tempo: "~4 min",
        descricao: "Aprenda as 5 vogais com atividades divertidas!",
        cor: "#7c79c8", modulo: "Fundamentos da Língua",
        chefe: false
    },
    {
        id: 2, titulo: "Consoantes", icone: "🔤",
        xp: 20, nivel: "Básico", tempo: "~5 min",
        descricao: "Conheça as consoantes e seus sons.",
        cor: "#7c79c8", modulo: "Fundamentos da Língua",
        chefe: false
    },
    {
        id: 3, titulo: "Sílabas", icone: "📝",
        xp: 25, nivel: "Básico", tempo: "~6 min",
        descricao: "Junte letras para formar sílabas.",
        cor: "#7c79c8", modulo: "Fundamentos da Língua",
        chefe: false
    },
    {
        id: 4, titulo: "Desafio I", icone: "🌟",
        xp: 40, nivel: "Médio", tempo: "~8 min",
        descricao: "Prove que domina os fundamentos!",
        cor: "#ff8c00", modulo: "Fundamentos da Língua",
        chefe: true
    },

    // MÓDULO 2 — Palavras
    {
        id: 5, titulo: "Palavras Curtas", icone: "🔠",
        xp: 25, nivel: "Básico", tempo: "~5 min",
        descricao: "Forme e leia palavras de 2-3 letras.",
        cor: "#5b8af0", modulo: "Mundo das Palavras",
        chefe: false
    },
    {
        id: 6, titulo: "Animais", icone: "🐾",
        xp: 30, nivel: "Básico", tempo: "~6 min",
        descricao: "Nomes de animais do cotidiano.",
        cor: "#5b8af0", modulo: "Mundo das Palavras",
        chefe: false
    },
    {
        id: 7, titulo: "Cores & Formas", icone: "🎨",
        xp: 30, nivel: "Básico", tempo: "~6 min",
        descricao: "Aprenda os nomes das cores e formas.",
        cor: "#5b8af0", modulo: "Mundo das Palavras",
        chefe: false
    },
    {
        id: 8, titulo: "Desafio II", icone: "⚡",
        xp: 50, nivel: "Médio", tempo: "~10 min",
        descricao: "Desafio de vocabulário completo!",
        cor: "#ff8c00", modulo: "Mundo das Palavras",
        chefe: true
    },

];

const XP_POR_NIVEL = 100;

const DICAS = [
    "Praticar um pouco todo dia é melhor do que estudar muito de vez em quando!",
    "Erros fazem parte do aprendizado. Continue tentando!",
    "Cada lição concluída é uma vitória! 🎉",
    "Quanto mais você pratica, mais fácil fica!",
    "Você está arrasando! Não pare agora! 🚀",
    "Pequenos passos levam a grandes conquistas.",
];

// ============================================================
// ESTADO DO JOGO
// ============================================================
let estado = carregarEstado();

function estadoInicial() {
    return {
        nome: "Explorador",
        xpTotal: 0,
        nivel: 1,
        streak: 0,
        gemasTotal: 50,
        ultimaAtividade: null,
        licoesConcluidas: [],
        progressoLicao: {}, // { id: percentual (0-100) }
        missoesConcluidas: 0,
        missoesDodia: 0,
        ultimoDiaMissao: null,
    };
}

function carregarEstado() {
    const salvo = localStorage.getItem('mapa_estado');
    if (salvo) {
        try {
            const parsed = JSON.parse(salvo);
            return { ...estadoInicial(), ...parsed };
        } catch (e) {
            return estadoInicial();
        }
    }
    return estadoInicial();
}

function salvarEstado() {
    localStorage.setItem('mapa_estado', JSON.stringify(estado));
}

// Verificar missão diária e streak ao carregar
function verificarDia() {
    const hoje = new Date().toDateString();
    if (estado.ultimoDiaMissao !== hoje) {
        estado.missoesDodia = 0;
        estado.ultimoDiaMissao = hoje;
    }
    // Streak — checar última atividade
    if (estado.ultimaAtividade) {
        const ultima = new Date(estado.ultimaAtividade);
        const diffDias = Math.floor((Date.now() - ultima.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDias > 1) {
            estado.streak = 0;
        }
    }
    salvarEstado();
}

// ============================================================
// FUNÇÕES DE ESTADO DAS LIÇÕES
// ============================================================
function getStatusLicao(id) {
    if (estado.licoesConcluidas.includes(id)) return 'concluido';

    // A primeira lição sempre está disponível
    if (id === 1) return (estado.licoesConcluidas.length === 0) ? 'atual' : 'concluido';

    // Uma lição está disponível se a anterior estiver concluída
    const indice = LICOES.findIndex(l => l.id === id);
    if (indice <= 0) return 'bloqueado';

    const anterior = LICOES[indice - 1];
    if (estado.licoesConcluidas.includes(anterior.id)) {
        // Verificar se é a próxima a ser feita
        const proxima = LICOES.find(l => !estado.licoesConcluidas.includes(l.id));
        if (proxima && proxima.id === id) return 'atual';
        return 'disponivel';
    }
    return 'bloqueado';
}

function calcularXPParaNivel(nivel) {
    return nivel * XP_POR_NIVEL;
}

function calcularNivel(xpTotal) {
    let nivel = 1;
    let xpAcumulado = 0;
    while (xpAcumulado + calcularXPParaNivel(nivel) <= xpTotal) {
        xpAcumulado += calcularXPParaNivel(nivel);
        nivel++;
    }
    return { nivel, xpNoNivel: xpTotal - xpAcumulado, xpParaProximo: calcularXPParaNivel(nivel) };
}

// ============================================================
// RENDERIZAR MAPA
// ============================================================
function renderizarMapa() {
    const container = document.getElementById('mapa-caminho');
    container.innerHTML = '';

    let moduloAtual = '';

    LICOES.forEach((licao, i) => {
        const status = getStatusLicao(licao.id);

        // Label de módulo
        if (licao.modulo !== moduloAtual) {
            moduloAtual = licao.modulo;
            const label = document.createElement('div');
            label.className = 'secao-label fade-up';
            label.textContent = licao.modulo;
            container.appendChild(label);
        }

        // Conector superior
        if (i > 0) {
            const conector = document.createElement('div');
            conector.className = 'no-conector' + (status !== 'bloqueado' ? ' ativo' : '');
            container.appendChild(conector);
        }

        // Grupo de nó
        const grupo = document.createElement('div');
        grupo.className = 'no-grupo fade-up';
        grupo.style.animationDelay = (i * 0.06) + 's';

        const no = criarNo(licao, status);
        grupo.appendChild(no);
        container.appendChild(grupo);
    });
}

function criarNo(licao, status) {
    const no = document.createElement('div');
    no.className = `no-licao ${status}${licao.chefe ? ' no-chefe' : ''}`;
    no.setAttribute('tabindex', status === 'bloqueado' ? '-1' : '0');
    no.setAttribute('role', 'button');
    no.setAttribute('aria-label', `Lição ${licao.titulo} — ${status}`);
    no.dataset.id = licao.id;

    const circulo = document.createElement('div');
    circulo.className = 'no-circulo';
    circulo.textContent = status === 'bloqueado' ? '' : licao.icone;
    circulo.style.setProperty('--no-cor', licao.cor);

    if (status === 'bloqueado') {
        const cadeado = document.createElement('span');
        cadeado.className = 'no-cadeado';
        cadeado.textContent = '🔒';
        circulo.appendChild(cadeado);
        circulo.textContent = '';
        circulo.appendChild(cadeado);
    }

    const xpBadge = document.createElement('div');
    xpBadge.className = 'no-xp-badge';
    xpBadge.textContent = `+${licao.xp} XP`;

    const titulo = document.createElement('p');
    titulo.className = 'no-titulo';
    titulo.textContent = licao.titulo;

    no.appendChild(circulo);
    no.appendChild(xpBadge);
    no.appendChild(titulo);

    // Eventos
    if (status !== 'bloqueado') {
        no.addEventListener('click', () => abrirModal(licao.id));
        no.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrirModal(licao.id);
            }
        });
    }

    return no;
}

// ============================================================
// SIDEBAR
// ============================================================
function atualizarSidebar() {
    const info = calcularNivel(estado.xpTotal);
    const pct = Math.round((info.xpNoNivel / info.xpParaProximo) * 100);

    document.getElementById('sb-nome').textContent = estado.nome;
    document.getElementById('sb-nivel').textContent = info.nivel;
    document.getElementById('sb-xp-total').textContent = estado.xpTotal;
    document.getElementById('sb-xp-bar').style.width = pct + '%';
    document.getElementById('sb-xp-proximo').textContent = `${info.xpNoNivel} / ${info.xpParaProximo} XP para próximo nível`;
    document.getElementById('sb-streak').textContent = estado.streak;
    document.getElementById('sb-licoes').textContent = estado.licoesConcluidas.length;
    document.getElementById('sb-gemas').textContent = estado.gemasTotal;

    // Ranking
    document.getElementById('rank-meu-xp').textContent = estado.xpTotal + ' XP';

    // Missão diária
    const progMissao = Math.min((estado.missoesDodia / 2) * 100, 100);
    document.getElementById('missao-prog').style.width = progMissao + '%';
    document.getElementById('missao-status').textContent = `${Math.min(estado.missoesDodia, 2)}/2 concluídas`;

    // Progresso global do mapa
    const totalLicoes = LICOES.length;
    const concluidas = estado.licoesConcluidas.length;
    const pctMapa = Math.round((concluidas / totalLicoes) * 100);
    document.getElementById('mapa-fases-texto').textContent = `${concluidas} de ${totalLicoes} fases concluídas`;
    document.getElementById('mapa-prog-fill').style.width = pctMapa + '%';

    // Conquistas
    atualizarConquistas();

    // Dica aleatória do dia
    const hoje = new Date().getDate();
    document.getElementById('dica-texto').textContent = DICAS[hoje % DICAS.length];
}

function atualizarConquistas() {
    const grid = document.getElementById('conquistas-grid');
    const items = grid.querySelectorAll('.conquista-item');

    // Regras: [já desbloqueada, condição]
    const conquistas = [
        { el: items[0], cond: true }, // Sempre desbloqueada (iniciante)
        { el: items[1], cond: estado.licoesConcluidas.length >= 5 },
        { el: items[2], cond: estado.streak >= 7 },
        { el: items[3], cond: estado.licoesConcluidas.length >= LICOES.length },
    ];

    conquistas.forEach(({ el, cond }) => {
        el.classList.toggle('desbloqueada', cond);
        el.classList.toggle('bloqueada', !cond);
    });
}

// ============================================================
// MODAL
// ============================================================
function abrirModal(id) {
    const licao = LICOES.find(l => l.id === id);
    if (!licao) return;

    const status = getStatusLicao(id);
    const progresso = estado.progressoLicao[id] || 0;

    document.getElementById('modal-icone').textContent = licao.icone;
    document.getElementById('modal-badge').textContent = `FASE ${id}`;
    document.getElementById('modal-titulo').textContent = licao.titulo;
    document.getElementById('modal-desc').textContent = licao.descricao;
    document.getElementById('modal-xp').textContent = `+${licao.xp} XP`;
    document.getElementById('modal-tempo').textContent = licao.tempo;
    document.getElementById('modal-nivel-txt').textContent = licao.nivel;

    // Barra de progresso da lição
    document.getElementById('modal-prog-bar-fill').style.width = progresso + '%';
    document.getElementById('modal-prog-pct').textContent = progresso + '% concluído';

    const btnIniciar = document.getElementById('btn-modal-iniciar');
    const btnContinuar = document.getElementById('btn-modal-secundario');

    if (status === 'concluido') {
        btnIniciar.textContent = '🔄 Refazer';
        btnContinuar.style.display = 'none';
    } else if (progresso > 0) {
        btnIniciar.textContent = '🚀 Começar!';
        btnContinuar.style.display = 'block';
        btnContinuar.textContent = '📖 Continuar (' + progresso + '%)';
    } else {
        btnIniciar.textContent = '🚀 Começar!';
        btnContinuar.style.display = 'none';
    }

    btnIniciar.onclick = () => iniciarLicao(id);
    btnContinuar.onclick = () => iniciarLicao(id);

    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('modal-fechar').focus();
}

function fecharModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
}

// ============================================================
// INICIAR LIÇÃO (SIMULADO)
// ============================================================
function iniciarLicao(id) {
    fecharModal();

    // Simular conclusão da lição com delay
    // Em produção, navegar para a página da lição
    setTimeout(() => {
        concluirLicao(id);
    }, 300);
}

function concluirLicao(id) {
    const licao = LICOES.find(l => l.id === id);
    if (!licao) return;

    const jaConcluida = estado.licoesConcluidas.includes(id);

    if (!jaConcluida) {
        // Adicionar XP
        estado.xpTotal += licao.xp;
        estado.licoesConcluidas.push(id);
        estado.progressoLicao[id] = 100;

        // Streak
        const hoje = new Date().toDateString();
        if (estado.ultimaAtividade !== hoje) {
            estado.streak += 1;
        }
        estado.ultimaAtividade = hoje;

        // Missão diária
        estado.missoesDodia = (estado.missoesDodia || 0) + 1;

        salvarEstado();
    } else {
        // Refazendo: XP reduzido
        const xpBonus = Math.floor(licao.xp * 0.25);
        estado.xpTotal += xpBonus;
        estado.progressoLicao[id] = 100;
        salvarEstado();
    }

    // Feedback visual
    mostrarXPToast(jaConcluida ? Math.floor(licao.xp * 0.25) : licao.xp);

    if (!jaConcluida) {
        setTimeout(dispararConfete, 100);
    }

    // Re-renderizar
    renderizarMapa();
    atualizarSidebar();
}

// ============================================================
// TOAST DE XP
// ============================================================
function mostrarXPToast(xp) {
    const toast = document.getElementById('xp-toast');
    const msg = document.getElementById('xp-toast-msg');
    msg.textContent = `+${xp} XP! ⭐`;
    toast.classList.remove('hidden', 'saindo');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.add('saindo');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2000);
}

// ============================================================
// CONFETE
// ============================================================
function dispararConfete() {
    const container = document.getElementById('confete-container');
    const cores = ['#f7c948', '#e84393', '#5b8af0', '#58c96a', '#ff8c00', '#7c79c8', '#ff4040'];

    for (let i = 0; i < 70; i++) {
        const piece = document.createElement('div');
        piece.className = 'confete-piece';
        piece.style.cssText = `
            left: ${Math.random() * 100}%;
            top: -10px;
            background: ${cores[Math.floor(Math.random() * cores.length)]};
            width: ${Math.random() * 8 + 6}px;
            height: ${Math.random() * 8 + 6}px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation-duration: ${Math.random() * 2 + 1.5}s;
            animation-delay: ${Math.random() * 0.8}s;
        `;
        container.appendChild(piece);
    }

    setTimeout(() => {
        container.innerHTML = '';
    }, 3500);
}

// ============================================================
// EVENTOS GLOBAIS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    verificarDia();
    renderizarMapa();
    atualizarSidebar();

    // Fechar modal
    document.getElementById('modal-fechar').addEventListener('click', fecharModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) fecharModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModal();
    });
});

// ============================================================
// UTILITÁRIOS EXTRAS (localStorage helpers)
// ============================================================
window.resetarJogo = function() {
    if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
        localStorage.removeItem('mapa_estado');
        estado = estadoInicial();
        renderizarMapa();
        atualizarSidebar();
    }
};
