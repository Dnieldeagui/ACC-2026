/* Controle da janela de criação de atividade personalizada (WordWall).
   Este arquivo cuida de abrir, fechar, salvar e limpar o link
   da atividade que o professor insere na trilha. */

document.addEventListener('DOMContentLoaded', () => {

    // Referências aos elementos da tela
    const btnAbrir     = document.getElementById('btn-abrir-link');     // ícone de criação de atividade
    const modal        = document.getElementById('modal-link');         // janela do link
    const btnFechar    = document.getElementById('btn-fechar-modal');   // botão "✕"
    const btnConfirmar = document.getElementById('btn-confirmar-link'); // botão "Confirmar"
    const btnLimpar    = document.getElementById('btn-limpar-link');    // botão "Limpar"
    const inputLink    = document.getElementById('input-link');         // campo do link
    const inputTurma = document.getElementById('input-turma')           // campo da Turma
    const inputNome = document.getElementById('input-nome');            // campo do Nome da atividade
    const feedback     = document.getElementById('modal-feedback');     // mensagem de feedback

    // Abre a janela.
    // Se já existia um link salvo antes, ele é recuperado no campo.
    function abrirModal() {
        modal.classList.remove('hidden');
        const salvo = localStorage.getItem('trilha-wordwall-link');
        if (salvo) inputLink.value = salvo;
        setTimeout(() => inputLink.focus(), 120);
    }

    // Fecha a janela e limpa a mensagem de feedback
    function fecharModal() {
        modal.classList.add('hidden');
        feedback.classList.remove('show');
        feedback.textContent = '';
    }

    // Abre e fecha pelos botões
    btnAbrir.addEventListener('click', abrirModal);
    btnFechar.addEventListener('click', fecharModal);

    // Também fecha ao clicar no fundo escurecido (fora da caixa da janela)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // Também fecha ao apertar a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) fecharModal();
    });

    // Botão "Confirmar": valida o link e salva
    btnConfirmar.addEventListener('click', (e) => {
    e.preventDefault();

    const nome = inputNome.value.trim();
    const link = inputLink.value.trim();
    const turma = inputTurma.value.trim();

    // Verifica se todos os campos estão preenchidos
    if (!nome || !link || !turma) {
        feedback.textContent = '⚠️ Preencha o nome, o link e a turma.';
        feedback.style.color = '#e74c3c';
        feedback.classList.add('show');
        return;
    }

    // Verifica se o link é do WordWall
    const pareceWordwall =
        /^https?:\/\/(www\.)?wordwall\.net\//i.test(link);

    if (!pareceWordwall) {
        feedback.textContent = '⚠️ Esse link não parece ser do WordWall.';
        feedback.style.color = '#e74c3c';
        feedback.classList.add('show');
        return;
    }

        // Envia o formulário somente após as validações
        document.getElementById('form-link').submit();


        // Salva o link na memória do navegador
        // (localStorage mantém o valor mesmo se fechar a página)
        localStorage.setItem('trilha-wordwall-link', link);

        // Mostra mensagem de sucesso e fecha a janela após 0,9s
        feedback.textContent = '✅ Atividade adicionada com sucesso!';
        feedback.style.color = '';
        feedback.classList.add('show');
        setTimeout(fecharModal, 900);
    });

    // Botão "Limpar": apaga o campo e o link salvo
    btnLimpar.addEventListener('click', () => {
        inputLink.value = '';
        localStorage.removeItem('trilha-wordwall-link');
        feedback.textContent = '🧹 Campo limpo.';
        feedback.style.color = '';
        feedback.classList.add('show');
        inputLink.focus();
    });
});