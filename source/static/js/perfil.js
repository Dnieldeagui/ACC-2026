/**
 * perfil.js — Lógica da Página de Perfil
 */

const AVATARES = ['🦊','🐸','🐼','🦁','🐯','🦋','🐙','🦄','🐳','🐻','🦖','🐬','🦅','🐝','🐢','🦆','🦉','🐨','🦊','🐮','🐷','🦀','🐙','🌟'];

const CONQUISTAS_DEF = [
    { icon: '🌱', titulo: 'Iniciante',   cond: s => true },
    { icon: '⭐', titulo: '5 Lições',    cond: s => (s.licoesConcluidas||[]).length >= 5 },
    { icon: '🔟', titulo: '10 Lições',   cond: s => (s.licoesConcluidas||[]).length >= 10 },
    { icon: '🔥', titulo: 'Semana',      cond: s => (s.streak||0) >= 7 },
    { icon: '🌙', titulo: '30 dias',     cond: s => (s.streak||0) >= 30 },
    { icon: '💎', titulo: 'Diamante',    cond: s => (s.xpTotal||0) >= 500 },
    { icon: '🚀', titulo: 'Explorador',  cond: s => (s.xpTotal||0) >= 1000 },
    { icon: '🏆', titulo: 'Campeão',     cond: s => (s.licoesConcluidas||[]).length >= 10 },
];

const LICOES_NOMES = {
    1: 'Vogais', 2: 'Consoantes', 3: 'Sílabas', 4: 'Desafio I',
    5: 'Palavras Curtas', 6: 'Animais', 7: 'Cores & Formas', 8: 'Desafio II',
};

const LICOES_ICONES = {
    1: '🅰️', 2: '🔤', 3: '📝', 4: '🌟',
    5: '🔠', 6: '🐾', 7: '🎨', 8: '⚡',
};

const LICOES_XP = { 1:15, 2:20, 3:25, 4:40, 5:25, 6:30, 7:30, 8:50 };

function carregarEstado() {
    try {
        return JSON.parse(localStorage.getItem('mapa_estado') || '{}');
    } catch { return {}; }
}

function calcularNivelInfo(xpTotal) {
    const XP_POR_NIVEL = 100;
    let nivel = 1, acum = 0;
    while (acum + (nivel * XP_POR_NIVEL) <= xpTotal) {
        acum += nivel * XP_POR_NIVEL;
        nivel++;
    }
    const xpNoNivel = xpTotal - acum;
    const xpParaProximo = nivel * XP_POR_NIVEL;
    return { nivel, xpNoNivel, xpParaProximo };
}

function renderizarPerfil() {
    const s = carregarEstado();
    const info = calcularNivelInfo(s.xpTotal || 0);

    // Avatar e nome
    document.getElementById('perfil-avatar').textContent = s.avatar || '🦊';
    document.getElementById('perfil-nome').textContent = s.nome || 'Explorador';
    document.getElementById('perfil-username').textContent = '@' + (s.username || 'explorador');

    // Stats
    document.getElementById('pstat-xp').textContent = s.xpTotal || 0;
    document.getElementById('pstat-streak').textContent = s.streak || 0;
    document.getElementById('pstat-licoes').textContent = (s.licoesConcluidas || []).length;
    document.getElementById('pstat-nivel').textContent = info.nivel;

    // XP Bar
    const pct = Math.round((info.xpNoNivel / info.xpParaProximo) * 100);
    document.getElementById('p-nivel-atual').textContent = 'Nível ' + info.nivel;
    document.getElementById('p-nivel-proximo').textContent = 'Nível ' + (info.nivel + 1);
    document.getElementById('p-xp-bar-fill').style.width = pct + '%';
    document.getElementById('p-xp-texto').textContent = `${info.xpNoNivel} / ${info.xpParaProximo} XP`;

    // Trilhas — calcular % baseado em lições concluídas
    const concluidas = s.licoesConcluidas || [];
    const licoesPt = [1, 2, 3, 4, 5, 6, 7, 8]; // IDs de língua portuguesa
    const pctPt = Math.round((concluidas.filter(id => licoesPt.includes(id)).length / licoesPt.length) * 100);
    document.getElementById('trilha-prog-1').style.width = pctPt + '%';
    document.getElementById('trilha-pct-1').textContent = pctPt + '%';
    
    renderizarConquistas(s);
    renderizarGrafico();
    renderizarHistorico(s);
}

function renderizarConquistas(s) {
    const grid = document.getElementById('conquistas-grid-perfil');
    grid.innerHTML = '';
    CONQUISTAS_DEF.forEach(def => {
        const desbloqueada = def.cond(s);
        const el = document.createElement('div');
        el.className = 'conquista-perfil ' + (desbloqueada ? 'desbloqueada' : 'bloqueada');
        el.title = def.titulo;
        el.innerHTML = `<span class="c-icon">${def.icon}</span><p>${def.titulo}</p>`;
        grid.appendChild(el);
    });
}

function renderizarGrafico() {
    const container = document.getElementById('atividade-grafico');
    container.innerHTML = '';
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const hoje = new Date().getDay();
    const historico = JSON.parse(localStorage.getItem('mapa_historico_semana') || '{}');

    for (let i = 6; i >= 0; i--) {
        const diaIndex = (hoje - i + 7) % 7;
        const chave = getDiaSemanaChave(i);
        const xpDia = historico[chave] || 0;
        const maxXP = 100;
        const altura = Math.min((xpDia / maxXP) * 86, 86);

        const wrap = document.createElement('div');
        wrap.className = 'ativ-barra-wrap';

        const barra = document.createElement('div');
        barra.className = 'ativ-barra' + (xpDia === 0 ? ' vazia' : '');
        barra.style.height = Math.max(altura, 4) + 'px';
        barra.title = `${dias[diaIndex]}: ${xpDia} XP`;

        const label = document.createElement('span');
        label.className = 'ativ-dia';
        label.textContent = dias[diaIndex].substring(0, 3);

        wrap.appendChild(barra);
        wrap.appendChild(label);
        container.appendChild(wrap);
    }
}

function getDiaSemanaChave(diasAtras) {
    const d = new Date();
    d.setDate(d.getDate() - diasAtras);
    return d.toDateString();
}

function renderizarHistorico(s) {
    const lista = document.getElementById('historico-lista');
    const concluidas = (s.licoesConcluidas || []).slice().reverse().slice(0, 6);

    if (concluidas.length === 0) {
        lista.innerHTML = '<li class="historico-vazio">Nenhuma lição concluída ainda. Vá para o Mapa e comece!</li>';
        return;
    }

    lista.innerHTML = '';
    concluidas.forEach(id => {
        const li = document.createElement('li');
        li.className = 'historico-item';
        li.innerHTML = `
            <span class="historico-icon">${LICOES_ICONES[id] || '📚'}</span>
            <div class="historico-info">
                <p class="historico-titulo">${LICOES_NOMES[id] || 'Lição ' + id}</p>
                <p class="historico-data">Concluída ✓</p>
            </div>
            <span class="historico-xp">+${LICOES_XP[id] || 0} XP</span>
        `;
        lista.appendChild(li);
    });
}

// === MODAL EDITAR PERFIL ===
function abrirModalEditar() {
    const s = carregarEstado();
    document.getElementById('edit-nome').value = s.nome || '';
    document.getElementById('edit-username').value = s.username || '';
    renderizarAvatarGrid(s.avatar || '🦊');
    document.getElementById('modal-editar').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function fecharModalEditar() {
    document.getElementById('modal-editar').classList.add('hidden');
    document.body.style.overflow = '';
}

function renderizarAvatarGrid(avatarAtual) {
    const grid = document.getElementById('avatar-grid');
    grid.innerHTML = '';
    AVATARES.forEach(av => {
        const btn = document.createElement('div');
        btn.className = 'avatar-opcao' + (av === avatarAtual ? ' selecionado' : '');
        btn.textContent = av;
        btn.addEventListener('click', () => {
            grid.querySelectorAll('.avatar-opcao').forEach(el => el.classList.remove('selecionado'));
            btn.classList.add('selecionado');
        });
        grid.appendChild(btn);
    });
}

function salvarPerfil() {
    const s = carregarEstado();
    const novoNome = document.getElementById('edit-nome').value.trim();
    const novoUsername = document.getElementById('edit-username').value.trim().replace('@', '');
    const selecionado = document.querySelector('.avatar-opcao.selecionado');

    s.nome = novoNome || s.nome;
    s.username = novoUsername || s.username;
    if (selecionado) s.avatar = selecionado.textContent;

    localStorage.setItem('mapa_estado', JSON.stringify(s));
    fecharModalEditar();
    renderizarPerfil();
}

// === EVENTOS ===
document.addEventListener('DOMContentLoaded', () => {
    renderizarPerfil();

    document.getElementById('btn-editar-perfil').addEventListener('click', abrirModalEditar);
    document.getElementById('btn-editar-avatar').addEventListener('click', abrirModalEditar);
    document.getElementById('perfil-avatar').addEventListener('click', abrirModalEditar);
    document.getElementById('modal-editar-fechar').addEventListener('click', fecharModalEditar);
    document.getElementById('btn-salvar-perfil').addEventListener('click', salvarPerfil);

    document.getElementById('modal-editar').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) fecharModalEditar();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModalEditar();
    });
});
