document.addEventListener('DOMContentLoaded', () => {
    const mapa = document.getElementById('mapa-trilha');
    if (!mapa) return;

    const totalFases = 15;
    const totalFuncional = 2; // Quantas fases o aluno pode jogar (mude para 15 quando tiver todas prontas)

    // Pega o nível atual do aluno (se não tiver, começa no 1)
    const nivelAluno = Number(localStorage.getItem('nivelAluno')) || 1;

    // Criar as fases
    for (let i = 1; i <= totalFases; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'map-node-wrapper';

        const node = document.createElement('button');
        node.id = `fase-${i}`;
        node.dataset.level = i;

        const bloco = Math.ceil(i / 5);
        const isCheckpoint = i % 5 === 0;

        if (i < nivelAluno) {

            node.className = `map-node node-completed bloco-${bloco}`;
            node.innerText = '⭐';
        } else if (i === nivelAluno) {

            node.className = `map-node node-current bloco-${bloco}`;
            node.innerText = i;
        } else {

            node.className = `map-node node-locked bloco-${bloco}`;
            node.innerText = i === 15 ? '🏆' : i;
        }


        if (isCheckpoint) node.classList.add('node-checkpoint');
        node.onclick = () => clicarFase(i);

        wrapper.appendChild(node);
        mapa.appendChild(wrapper);
    }

    function clicarFase(n) {
        const node = document.getElementById(`fase-${n}`);
        
        // Se for a fase atual OU se já estiver concluída (estrela), deixa jogar!
        if (node.classList.contains('node-current') || node.classList.contains('node-completed')) {
            window.location.href = `/trilhas/atividades?fase=${n}`;
        } 
        // Se estiver bloqueada, faz o "chacoalhar"
        else if (node.classList.contains('node-locked')) {
            node.style.animation = 'shake 0.4s';
            setTimeout(() => node.style.animation = '', 400);
        }
    }
});