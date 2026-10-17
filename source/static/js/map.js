document.addEventListener('DOMContentLoaded', () => {
    const mapa = document.getElementById('mapa-trilha');
    if (!mapa) return;

    const totalFases = 15;
    const totalFuncional = 2; // só até aqui a trilha é jogável; 3-15 ficam só de exibição

    // Criar as fases
    for (let i = 1; i <= totalFases; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'map-node-wrapper';

        const node = document.createElement('button');
        node.id = `fase-${i}`;
        node.dataset.level = i;

        const bloco = Math.ceil(i / 5);
        const isCheckpoint = i % 5 === 0;

        if (i === 1) {
            node.className = `map-node node-current bloco-${bloco}`;
            node.innerText = '1';
        } else {
            node.className = `map-node node-locked bloco-${bloco}`;
            node.innerText = i === 15 ? '🏆' : i;
        }
        if (isCheckpoint) node.classList.add('node-checkpoint');
        node.onclick = () => clicarFase(i);

        wrapper.appendChild(node);
        mapa.appendChild(wrapper);
    }

    const faseConcluidaAgora = Number(localStorage.getItem('faseConcluida'));
    if (faseConcluidaAgora) {
        const nodeConcluido = document.getElementById(`fase-${faseConcluidaAgora}`);
        if (nodeConcluido && nodeConcluido.classList.contains('node-current')) {
            nodeConcluido.classList.replace('node-current', 'node-completed');
            nodeConcluido.innerText = '⭐';

            const proxima = document.getElementById(`fase-${faseConcluidaAgora + 1}`);
            if (proxima && faseConcluidaAgora < totalFuncional) {
                proxima.classList.replace('node-locked', 'node-current');
            } else {
                alert("Parabéns! Você completou as atividades disponíveis! 🏆");
            }
        }
        localStorage.removeItem('faseConcluida');
    }

    function clicarFase(n) {
        const node = document.getElementById(`fase-${n}`);
        if (node.classList.contains('node-current')) {
            window.location.href = `/trilhas/atividades?fase=${n}`;
        } else if (node.classList.contains('node-locked')) {
            node.style.animation = 'shake 0.4s';
            setTimeout(() => node.style.animation = '', 400);
        }
    }
});