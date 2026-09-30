document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE CONFIGURAÇÕES (SUA ORIGINAL) ---
    const btnSettings = document.getElementById('btn-settings');
    const settingsDropdown = document.getElementById('settings-dropdown');

    btnSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!settingsDropdown.contains(e.target) && !btnSettings.contains(e.target)) {
            settingsDropdown.classList.add('hidden');
        }
    });

    const themeSwitch = document.querySelector('#checkbox');
    themeSwitch.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
        localStorage.setItem('theme', e.target.checked ? 'dark-mode' : 'light-mode');
    });

    const dyslexiaSwitch = document.querySelector('#dyslexia-checkbox');
    dyslexiaSwitch.addEventListener('change', (e) => {
        document.body.classList.toggle('dyslexia-mode', e.target.checked);
        localStorage.setItem('accessibility', e.target.checked ? 'dyslexia-mode' : 'standard');
    });

    // Manter estados ao carregar
    if (localStorage.getItem('theme') === 'dark-mode') {
        document.body.classList.add('dark-mode');
        themeSwitch.checked = true;
    }
    if (localStorage.getItem('accessibility') === 'dyslexia-mode') {
        document.body.classList.add('dyslexia-mode');
        dyslexiaSwitch.checked = true;
    }

    // --- LÓGICA FUNCIONAL DO MAPA ---
    const mapa = document.getElementById('mapa-trilha');
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

        // Define a primeira como atual, as outras bloqueadas
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

    // Se voltou da página de atividades tendo concluído uma fase
    // (roda uma única vez, ao carregar a página — fora de clicarFase)
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
            // Redireciona para a página de atividades da fase
            // === INÍCIO DA ALTERAÇÃO ===
            window.location.href = `atividades/atividades.html?fase=${n}`;
            // === FIM DA ALTERAÇÃO ===
        } else if (node.classList.contains('node-locked')) {
            // Animação de erro (shake seu original)
            node.style.animation = 'shake 0.4s';
            setTimeout(() => node.style.animation = '', 400);
        }
    }
});