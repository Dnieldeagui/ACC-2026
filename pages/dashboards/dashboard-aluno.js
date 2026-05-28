/**
 * dashboard-aluno.js — Dashboard Gamificado do Aluno
 */

const LICOES_INFO = {
    1:  { titulo: 'Vogais',         icone: '🅰️', xp: 15 },
    2:  { titulo: 'Consoantes',     icone: '🔤', xp: 20 },
    3:  { titulo: 'Sílabas',        icone: '📝', xp: 25 },
    4:  { titulo: 'Desafio I',      icone: '🌟', xp: 40 },
    5:  { titulo: 'Palavras Curtas',icone: '🔠', xp: 25 },
    6:  { titulo: 'Animais',        icone: '🐾', xp: 30 },
    7:  { titulo: 'Cores & Formas', icone: '🎨', xp: 30 },
    8:  { titulo: 'Desafio II',     icone: '⚡', xp: 50 },
    9:  { titulo: 'Números 1-10',   icone: '🔢', xp: 20 },
    10: { titulo: 'Desafio III',    icone: '👑', xp: 60 },
};

const CONQUISTAS = [
    { icon: '🌱', titulo: 'Iniciante',  cond: s => true },
    { icon: '⭐', titulo: '5 Lições',   cond: s => (s.licoesConcluidas||[]).length >= 5 },
    { icon: '🔥', titulo: 'Semana',     cond: s => (s.streak||0) >= 7 },
    { icon: '🏆', titulo: 'Campeão',    cond: s => (s.licoesConcluidas||[]).length >= 10 },
];

const SAUDACOES = [
    'Olá', 'E aí', 'Oi', 'Que bom ver você', 'Bem-vindo de volta'
];

function carregarEstado() {
    try { return JSON.parse(localStorage.getItem('mapa_estado') || '{}'); } catch { return {}; }
}

function calcularNivel(xpTotal) {
    const XP = 100;
    let nivel = 1, acum = 0;
    while (acum + (nivel * XP) <= xpTotal) { acum += nivel * XP; nivel++; }
    return { nivel, xpNoNivel: xpTotal - acum, xpParaProximo: nivel * XP };
}

function proximaLicao(concluidas) {
    for (let id = 1; id <= 10; id++) {
        if (!concluidas.includes(id)) return id;
    }
    return null; // todas concluídas
}

function renderizarDashboard() {
    const s = carregarEstado();
    const concluidas = s.licoesConcluidas || [];
    const xpTotal    = s.xpTotal || 0;
    const streak     = s.streak  || 0;
    const nivel      = calcularNivel(xpTotal);
    const saudacao   = SAUDACOES[new Date().getHours() % SAUDACOES.length];
    const nome       = s.nome || 'Explorador';

    /* ── Hero ── */
    document.getElementById('hero-titulo').textContent = `${saudacao}, ${nome}! 👋`;
    document.getElementById('hero-sub').textContent =
        concluidas.length === 0 ? 'Pronto para aprender algo novo hoje?' :
        streak > 0 ? `🔥 ${streak} dias de ofensiva! Continue assim!` :
        'Que tal retomar sua jornada?';
    document.getElementById('hero-avatar').textContent = s.avatar || '🦊';

    /* ── Stats ── */
    document.getElementById('dstat-xp').textContent     = xpTotal;
    document.getElementById('dstat-streak').textContent = streak;
    document.getElementById('dstat-licoes').textContent = concluidas.length;
    document.getElementById('dstat-nivel').textContent  = nivel.nivel;
    document.getElementById('dstat-gemas').textContent  = s.gemasTotal || 50;

    /* ── XP Bar ── */
    const pct = Math.round((nivel.xpNoNivel / nivel.xpParaProximo) * 100);
    document.getElementById('dash-nivel-txt').textContent  = 'Nível ' + nivel.nivel;
    document.getElementById('dash-xp-txt').textContent     = `${nivel.xpNoNivel} / ${nivel.xpParaProximo} XP`;
    document.getElementById('dash-nivel-prox').textContent = 'Nível ' + (nivel.nivel + 1);
    document.getElementById('dash-xp-fill').style.width    = pct + '%';

    /* ── Próxima Lição ── */
    const proxId   = proximaLicao(concluidas);
    const proxInfo = proxId ? LICOES_INFO[proxId] : null;
    document.getElementById('pl-icone').textContent = proxInfo ? proxInfo.icone : '🎉';
    document.getElementById('pl-titulo').textContent = proxInfo ? proxInfo.titulo : 'Parabéns!';
    document.getElementById('pl-desc').textContent  = proxInfo
        ? 'Próxima lição disponível'
        : 'Você concluiu todas as lições!';
    document.getElementById('pl-xp-badge').textContent = proxInfo ? `+${proxInfo.xp} XP` : '';

    /* ── Missão Diária ── */
    const missoes = s.missoesDodia || 0;
    atualizarCheckMissao('dmissao-1', 'dmcheck-1', missoes >= 1);
    atualizarCheckMissao('dmissao-2', 'dmcheck-2', missoes >= 2);
    atualizarCheckMissao('dmissao-3', 'dmcheck-3', xpTotal >= 30);
    const totalFeitas = (missoes >= 1 ? 1 : 0) + (missoes >= 2 ? 1 : 0) + (xpTotal >= 30 ? 1 : 0);
    document.getElementById('missao-prog-fill-d').style.width = ((totalFeitas / 3) * 100) + '%';
    document.getElementById('missao-prog-txt').textContent    = `${totalFeitas}/3`;

    /* ── Streak ── */
    document.getElementById('streak-num-big').textContent = streak;
    document.getElementById('streak-msg-small').textContent =
        streak === 0 ? 'Comece hoje!' :
        streak < 3  ? 'Bom começo, continue!' :
        streak < 7  ? `${streak} dias! Você está pegando fogo! 🔥` :
        `Incrível! ${streak} dias seguidos! 👑`;

    /* ── Atividade Recente ── */
    const lista = document.getElementById('recentes-lista');
    const recentes = [...concluidas].reverse().slice(0, 4);
    if (recentes.length === 0) {
        lista.innerHTML = '<li class="recente-vazio">Nenhuma lição ainda.<br><a href="../Mapa.html">Comece agora! 🚀</a></li>';
    } else {
        lista.innerHTML = '';
        recentes.forEach(id => {
            const info = LICOES_INFO[id] || {};
            const li   = document.createElement('li');
            li.className = 'recente-item';
            li.innerHTML = `
                <span class="recente-icon">${info.icone || '📚'}</span>
                <span class="recente-nome">${info.titulo || 'Lição ' + id}</span>
                <span class="recente-xp">+${info.xp || 0} XP</span>
            `;
            lista.appendChild(li);
        });
    }

    /* ── Conquistas ── */
    const cqGrid = document.getElementById('cq-grid');
    cqGrid.innerHTML = '';
    CONQUISTAS.forEach(c => {
        const ok  = c.cond(s);
        const div = document.createElement('div');
        div.className = 'cq-item ' + (ok ? 'desbloqueada' : 'bloqueada');
        div.innerHTML = `<span>${c.icon}</span><p>${c.titulo}</p>`;
        cqGrid.appendChild(div);
    });

    /* ── Ranking ── */
    document.getElementById('rq-voce').textContent = xpTotal + ' XP';
}

function atualizarCheckMissao(itemId, checkId, feita) {
    const item  = document.getElementById(itemId);
    const check = document.getElementById(checkId);
    if (feita) {
        item.classList.add('feita');
        check.textContent = '✓';
    } else {
        item.classList.remove('feita');
        check.textContent = '○';
    }
}

document.addEventListener('DOMContentLoaded', renderizarDashboard);
