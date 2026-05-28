/**
 * ofensiva.js — Lógica da Página de Ofensiva (Streak)
 */

const BADGES_STREAK = [
    { icon: '🌱', titulo: '3 dias',   min: 3 },
    { icon: '🔥', titulo: '7 dias',   min: 7 },
    { icon: '⚡', titulo: '14 dias',  min: 14 },
    { icon: '🌙', titulo: '30 dias',  min: 30 },
    { icon: '💎', titulo: '60 dias',  min: 60 },
    { icon: '🏆', titulo: '100 dias', min: 100 },
    { icon: '🌟', titulo: '180 dias', min: 180 },
    { icon: '👑', titulo: '365 dias', min: 365 },
];

const MENSAGENS_STREAK = [
    { min: 0,   msg: "Comece sua jornada hoje! 🚀" },
    { min: 1,   msg: "Bom começo! Continue assim! 💪" },
    { min: 3,   msg: "3 dias seguidos! Você é incrível! 🌱" },
    { min: 7,   msg: "Uma semana inteira! Você é fogo! 🔥" },
    { min: 14,  msg: "Duas semanas! Hábito formado! ⚡" },
    { min: 30,  msg: "Um mês! Você é uma lenda! 🏆" },
    { min: 60,  msg: "Dois meses de dedicação! 💎" },
    { min: 100, msg: "100 dias! Você é um mestre! 👑" },
];

function carregarEstado() {
    try {
        return JSON.parse(localStorage.getItem('mapa_estado') || '{}');
    } catch { return {}; }
}

function getMensagem(streak) {
    let msg = MENSAGENS_STREAK[0].msg;
    for (const m of MENSAGENS_STREAK) {
        if (streak >= m.min) msg = m.msg;
    }
    return msg;
}

function renderizarHero(s) {
    const streak = s.streak || 0;

    // Contador
    const numEl = document.getElementById('streak-numero');
    numEl.textContent = streak;
    numEl.classList.add('pulsar');
    setTimeout(() => numEl.classList.remove('pulsar'), 500);

    // Mensagem
    document.getElementById('streak-mensagem').textContent = getMensagem(streak);

    // Ring de progresso (meta: 7 dias)
    const meta = 7;
    const pct = Math.min(streak / meta, 1);
    const circunferencia = 327;
    const offset = circunferencia - pct * circunferencia;
    document.getElementById('ring-fill').style.strokeDashoffset = offset;
    document.getElementById('ring-pct').textContent = Math.round(pct * 100) + '%';

    // Ranking
    const maxStreak = 32;
    const pctMe = Math.min((streak / maxStreak) * 100, 100);
    document.getElementById('rs-bar-me').style.width = pctMe + '%';
    document.getElementById('rs-me-dias').textContent = streak + ' dias';
}

function renderizarMetas(s) {
    const licoesDia = s.missoesDodia || 0;
    const xpTotal = s.xpTotal || 0;
    const xpHoje = 0; // simplificado — em produção, rastrear XP diário

    // Meta 1: 1 lição
    atualizarMeta('meta-1', 'check-1', licoesDia >= 1);
    // Meta 2: 2 lições
    atualizarMeta('meta-2', 'check-2', licoesDia >= 2);
    // Meta 3: 30 XP — usar total como aproximação
    atualizarMeta('meta-3', 'check-3', xpTotal >= 30);
}

function atualizarMeta(metaId, checkId, concluida) {
    const meta = document.getElementById(metaId);
    const check = document.getElementById(checkId);
    if (concluida) {
        meta.classList.add('concluida');
        check.classList.remove('pendente');
        check.textContent = '✓';
    } else {
        meta.classList.remove('concluida');
        check.classList.add('pendente');
        check.textContent = '○';
    }
}

function renderizarCalendario(s) {
    const container = document.getElementById('calendario-grid');
    container.innerHTML = '';

    const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Labels
    DIAS_SEMANA.forEach(dia => {
        const label = document.createElement('div');
        label.className = 'cal-dia-label';
        label.textContent = dia.substring(0, 1);
        container.appendChild(label);
    });

    const hoje = new Date();
    const streak = s.streak || 0;

    // Exibir últimas 4 semanas (28 dias)
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - 27);

    // Preencher dias vazios no início da semana
    const primeiroDia = inicio.getDay();
    for (let i = 0; i < primeiroDia; i++) {
        const empty = document.createElement('div');
        container.appendChild(empty);
    }

    for (let i = 0; i <= 27; i++) {
        const data = new Date(inicio);
        data.setDate(inicio.getDate() + i);
        const eHoje = data.toDateString() === hoje.toDateString();
        const diasAtras = Math.floor((hoje - data) / (1000 * 60 * 60 * 24));
        const eAtivo = diasAtras < streak && streak > 0;
        const eFuturo = data > hoje;

        const div = document.createElement('div');
        div.className = 'cal-dia';
        div.textContent = data.getDate();
        if (eAtivo) div.classList.add('ativo');
        if (eHoje) div.classList.add('hoje');
        if (eFuturo) div.classList.add('futuro');
        div.title = data.toLocaleDateString('pt-BR');
        container.appendChild(div);
    }
}

function renderizarGrafico(s) {
    const container = document.getElementById('semana-grafico');
    container.innerHTML = '';
    const DIAS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const hoje = new Date();
    const historico = JSON.parse(localStorage.getItem('mapa_historico_semana') || '{}');
    const streak = s.streak || 0;

    for (let i = 6; i >= 0; i--) {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - i);
        const chave = d.toDateString();
        const diasAtras = i;
        const ativo = diasAtras < streak;
        const xpDia = ativo ? (historico[chave] || Math.floor(Math.random() * 50 + 10)) : (historico[chave] || 0);
        const maxXP = 100;
        const alturaPct = Math.min((xpDia / maxXP) * 100, 100);

        const item = document.createElement('div');
        item.className = 'semana-item';

        item.innerHTML = `
            <div class="semana-barra-wrap">
                <div class="semana-barra${xpDia === 0 ? ' vazia' : ''}" style="height: ${Math.max(alturaPct, 4)}%" title="${xpDia} XP"></div>
            </div>
            <span class="semana-val">${xpDia > 0 ? xpDia : ''}</span>
            <span class="semana-dia">${DIAS[d.getDay()].substring(0,3)}</span>
        `;
        container.appendChild(item);
    }
}

function renderizarRecordes(s) {
    const streak = s.streak || 0;
    const maxStreak = Math.max(streak, s.maiorStreak || 0);
    const totalDias = (s.licoesConcluidas || []).length;
    const xpTotal = s.xpTotal || 0;

    document.getElementById('recorde-atual').textContent = streak;
    document.getElementById('recorde-max').textContent = maxStreak;
    document.getElementById('total-dias').textContent = totalDias;
    document.getElementById('total-xp').textContent = xpTotal;
}

function renderizarBadges(s) {
    const streak = s.streak || 0;
    const grid = document.getElementById('badges-grid');
    grid.innerHTML = '';

    BADGES_STREAK.forEach(badge => {
        const desbloqueado = streak >= badge.min;
        const el = document.createElement('div');
        el.className = 'badge-item ' + (desbloqueado ? 'desbloqueado' : 'bloqueado');
        el.title = badge.titulo + (desbloqueado ? ' ✓' : ' — ' + badge.min + ' dias necessários');
        el.innerHTML = `<span class="badge-icon">${badge.icon}</span><p>${badge.titulo}</p>`;
        grid.appendChild(el);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const s = carregarEstado();
    renderizarHero(s);
    renderizarMetas(s);
    renderizarCalendario(s);
    renderizarGrafico(s);
    renderizarRecordes(s);
    renderizarBadges(s);
});
