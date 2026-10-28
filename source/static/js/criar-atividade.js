document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Cria o Botão Flutuante (FAB) na tela
    let btnAbrir = document.getElementById('btn-abrir-link');
    if (!btnAbrir) {
        btnAbrir = document.createElement('button');
        btnAbrir.id = 'btn-abrir-link';
        btnAbrir.className = 'fab-criar';
        btnAbrir.innerHTML = '<span class="fab-icon">+</span><span class="fab-text">Criar atividade</span>';
        document.body.appendChild(btnAbrir);
    }

    // 2. Cria o Modal na tela (se ele já não existir no HTML)
    let modal = document.getElementById('modal-link');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-link';
        modal.className = 'modal-overlay hidden';
        modal.innerHTML = `
            <div class="modal-content">
                <button id="btn-fechar-modal" class="modal-close" aria-label="Fechar" type="button">✕</button>
                <h2 class="titulo-login">Criar Atividade Personalizada</h2>
                <p class="subtitulo-cadastro">Cole abaixo o link de uma atividade do WordWall.</p>
                
                <form id="form-link" action="/mapa" method="POST">
                    <div class="dados">
                        <label for="input-nome">Nome da atividade</label>
                        <input type="text" id="input-nome" name="atividade" placeholder="Ex.: Sinônimos" required>
                    </div>
                    <div class="dados">
                        <label for="input-link">Link (WordWall)</label>
                        <input type="url" id="input-link" name="link" placeholder="https://wordwall.net/pt/resource/..." required>
                    </div>
                    <div class="dados">
                        <label for="input-turma">Turma</label>
                        <select id="input-turma" name="turma" required style="width: 100%; padding: 14px 18px; border-radius: 14px; background-color: var(--input-bg); color: var(--text-main); border: 3px solid var(--border-color); font-family: 'Quicksand', sans-serif; font-weight: 600;">
                            <option value="" disabled selected>Selecione uma turma...</option>
                            <!-- O JS vai tentar puxar as turmas do HTML existente se houver -->
                        </select>
                    </div>
                    <div class="modal-botoes">
                        <button id="btn-confirmar-link" class="btn-primario" type="submit">Confirmar</button>
                        <button id="btn-limpar-link" class="btn-secundario" type="button">Limpar</button>
                    </div>
                </form>
                <p id="modal-feedback" class="modal-feedback"></p>
            </div>
        `;
        document.body.appendChild(modal);

        // Tenta puxar as opções de turma do HTML da página (se existirem)
        const turmasOriginais = document.querySelectorAll('select[name="turma"] option');
        const selectNova = modal.querySelector('#input-turma');
        if (turmasOriginais.length > 0) {
            turmasOriginais.forEach(opt => {
                if(opt.value) selectNova.appendChild(opt.cloneNode(true));
            });
        }
    }

    // 3. Referências dos elementos
    const btnFechar    = document.getElementById('btn-fechar-modal');   
    const btnConfirmar = document.getElementById('btn-confirmar-link'); 
    const btnLimpar    = document.getElementById('btn-limpar-link');    
    const inputLink    = document.getElementById('input-link');         
    const inputTurma   = document.getElementById('input-turma');        
    const inputNome    = document.getElementById('input-nome');         
    const feedback     = document.getElementById('modal-feedback');     

    // 4. Funções de Abrir e Fechar com Animação
    function abrirModal() {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('show'); 
            if(inputLink) inputLink.focus();
        }, 10);
    }

    function fecharModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
            if(feedback) {
                feedback.classList.remove('show');
                feedback.textContent = '';
            }
        }, 300);
    }

    // 5. Eventos de Clique
    if(btnAbrir) btnAbrir.addEventListener('click', abrirModal);
    if(btnFechar) btnFechar.addEventListener('click', fecharModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) fecharModal();
    });

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', (e) => {
            e.preventDefault();
            const nome = inputNome.value.trim();
            const link = inputLink.value.trim();
            const turma = inputTurma.value.trim();

            if (!nome || !link || !turma) {
                feedback.textContent = '⚠️ Preencha todos os campos.';
                feedback.style.color = '#e74c3c';
                feedback.classList.add('show');
                return;
            }

            const pareceWordwall = /^https?:\/\/(www\.)?wordwall\.net\//i.test(link);
            if (!pareceWordwall) {
                feedback.textContent = '⚠️ Esse link não parece ser do WordWall.';
                feedback.style.color = '#e74c3c';
                feedback.classList.add('show');
                return;
            }

            document.getElementById('form-link').submit();
        });
    }

    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            inputLink.value = '';
            localStorage.removeItem('trilha-wordwall-link');
            feedback.textContent = '🧹 Campo limpo.';
            feedback.style.color = '';
            feedback.classList.add('show');
            inputLink.focus();
        });
    }
});