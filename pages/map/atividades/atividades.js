document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const fase = Number(params.get('fase'));

    const original = jogosWordwall[fase];
    if (!original || original.length === 0) {
        document.getElementById('titulo-atividade').innerText = 'Nenhuma atividade encontrada para esta fase.';
        return;
    }

    // Embaralha (Fisher-Yates) — mesmo conjunto, ordem sempre diferente
    function embaralhar(array) {
        const copia = [...array];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }

    const ordemDaVez = embaralhar(original);
    let indiceAtual = 0;

    const titulo = document.getElementById('titulo-atividade');
    const progresso = document.getElementById('progresso-atividades');
    const iframe = document.getElementById('iframe-jogo');
    const btnProxima = document.getElementById('btn-proxima');

    function renderizarAtividade() {
        const atividade = ordemDaVez[indiceAtual];
        titulo.innerText = atividade.titulo;
        iframe.src = atividade.embedUrl;

        progresso.innerHTML = '';
        ordemDaVez.forEach((_, i) => {
            const bolinha = document.createElement('span');
            bolinha.className = 'progresso-bolinha' + (i <= indiceAtual ? ' feita' : '');
            progresso.appendChild(bolinha);
        });

        btnProxima.innerText = (indiceAtual === ordemDaVez.length - 1)
            ? 'Concluir fase ✓'
            : 'Próxima atividade →';
    }

    btnProxima.addEventListener('click', () => {
        if (indiceAtual < ordemDaVez.length - 1) {
            indiceAtual++;
            renderizarAtividade();
        } else {
            // Marca a fase como concluída e volta para a trilha
            localStorage.setItem('faseConcluida', String(fase));
            // === INÍCIO DA ALTERAÇÃO ===
            window.location.href = '../Prot.html';
            // === FIM DA ALTERAÇÃO ===
        }
    });

    renderizarAtividade();
});