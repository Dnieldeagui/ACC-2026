// Aguarda o HTML carregar completamente antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // Pega os dados do Python que foram passados via atributos data-* no HTML
    const divDados = document.getElementById('dados-usuario');
    const isProfessor = divDados ? divDados.dataset.professor === 'true' : false;
    const loggedUser = divDados ? divDados.dataset.nome : 'Usuário';
    const turmas = divDados ? JSON.parse(divDados.dataset.turmas || '[]') : [];

    // Usei o localStorage (memória do navegador)
    // para simular o banco de dados de turmas. Quando o backend estiver pronto,
    // essas variáveis podem ser preenchidas pelo python

    // Função chamada pelo botão "Criar Turma" do professor
    window.profCriarTurma = function(isNova = false) {
        const anoInput = isNova
            ? document.getElementById('input-ano-novo')
            : document.getElementById('input-ano');
        const disciplinaInput = isNova
            ? document.getElementById('input-disciplina-nova')
            : document.getElementById('input-disciplina');

        if (!anoInput.value || !disciplinaInput.value) {
            alert("Preencha todos os campos!");
            return;
        }

        // Gera o código no JS
        const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Pega o form que contém o input
        const form = anoInput.closest('form');

        // Adiciona o hidden do código
        let hidden = form.querySelector('input[name="codigo"]');
        if (!hidden) {
            hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.name = 'codigo';
            form.appendChild(hidden);
        }
        hidden.value = codigo;

        // Envia para o Flask
        form.submit();
    };

    // Função para o aluno tentar entrar em uma turma
    window.alunoEntrarTurma = function(isNova = false) {
        const codigoInput = isNova
            ? document.getElementById('input-novo-codigo')
            : document.getElementById('input-codigo-aluno');
        const codigo = codigoInput.value.toUpperCase().trim();

        if (!codigo) return alert("Digite um código!");

        // Cria um form e envia para /turmas
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/turmas';
        form.innerHTML = `<input type="hidden" name="codigo" value="${codigo}">`;
        document.body.appendChild(form);
        form.submit();
    };

    // Funções para mostrar os formulários escondidos
    window.mostrarFormProf = function() { document.getElementById('form-nova-turma-prof').classList.remove('hidden'); }
    window.mostrarInputAluno = function() { document.getElementById('input-nova-turma-aluno').classList.remove('hidden'); }

    // Renderiza os cards de turmas na tela
    function renderizarTurmas() {
        // PARTE DO ALUNO
    const boxAlunoSem = document.getElementById('aluno-sem-turma');
    const boxAlunoCom = document.getElementById('aluno-com-turma');
    const listaAluno = document.getElementById('lista-turmas-aluno');

    listaAluno.innerHTML = '';

    if (turmas.length > 0) {
        boxAlunoSem.classList.add('hidden');
        boxAlunoCom.classList.remove('hidden');

        turmas.forEach(t => {
            listaAluno.innerHTML += `
                <div class="turma-card">
                    <div>
                        <strong>${t[0]} - ${t[1]}</strong><br>
                        <span style="font-size: 0.9em; color: var(--text-muted);">Prof. ${loggedUser}</span>
                    </div>
                    <div class="codigo-turma">${t[2]}</div>
                </div>
            `;
        });
    } else {
        boxAlunoSem.classList.remove('hidden');
        boxAlunoCom.classList.add('hidden');
    }

        // PARTE DO PROFESSOR
    const boxProfSem = document.getElementById('prof-sem-turma');
    const boxProfCom = document.getElementById('prof-com-turma');
    const listaProf = document.getElementById('lista-turmas-prof');

    listaProf.innerHTML = '';
    
    if (turmas.length > 0) {
        boxProfSem.classList.add('hidden');
        boxProfCom.classList.remove('hidden');

        turmas.forEach(t => {
            listaProf.innerHTML += `
                <div class="turma-card">
                    <div>
                        <strong>${t[0]} - ${t[1]}</strong><br>
                        <span style="font-size: 0.9em; color: var(--text-muted);">Código para os alunos:</span>
                    </div>
                    <div class="codigo-turma">${t[2]}</div>
                </div>
            `;
        });
    } else {
        boxProfSem.classList.remove('hidden');
        boxProfCom.classList.add('hidden');
    }
    }

    // Renderiza a lista de pessoas no quadrado da direita
    function renderizarPessoas() {
        const lista = document.getElementById('lista-pessoas');
        const tituloPessoas = document.getElementById('titulo-pessoas');
        lista.innerHTML = '';

        const temTurma = turmas.length > 0;
        
        if (!temTurma) {
            tituloPessoas.innerText = "Pessoas";
            lista.innerHTML = `<p style="color: var(--text-muted);">Você precisa estar em uma turma para ver as pessoas.</p>`;
            return;
        }

        // Muda o título dependendo de quem está logado
        tituloPessoas.innerText = isProfessor ? "Pessoas nas suas turmas" : "Colegas e Professores";

        // IMPORTANTE: Aqui seriam puxados os alunos e professores reais do banco de dados.
        // Por enquanto to usando dados fixos para testar o layout.
        const professores = [{ nome: isProfessor ? loggedUser : "Prof. Carlos", cargo: "Professor" }];
        const alunos = [
            { nome: isProfessor ? "Lucas Aluno" : loggedUser, cargo: "Aluno" },
            { nome: "Maria Clara", cargo: "Aluno" },
            { nome: "João Pedro", cargo: "Aluno" }
        ];

        // Monta o HTML dos professores
        let html = `<h4 style="margin-bottom: 10px; color: var(--text-muted);">Professores</h4>`;
        professores.forEach(p => {
            // Adiciona o destaque (você) se o nome for igual ao do usuário logado
            const voceTag = (p.nome === loggedUser) ? ' <span class="destaque-voce">(você)</span>' : '';
            html += `<div class="pessoa-item"><span>${p.nome}${voceTag}</span> <span class="pessoa-cargo">${p.cargo}</span></div>`;
        });

        // Monta o HTML dos alunos
        html += `<h4 style="margin: 20px 0 10px 0; color: var(--text-muted);">Alunos</h4>`;
        alunos.forEach(a => {
            const voceTag = (a.nome === loggedUser) ? ' <span class="destaque-voce">(você)</span>' : '';
            html += `<div class="pessoa-item"><span>${a.nome}${voceTag}</span> <span class="pessoa-cargo">${a.cargo}</span></div>`;
        });

        lista.innerHTML = html;
    }

    // Renderiza o quadro de atividades
    function renderizarAtividades() {
        const box = document.getElementById('box-atividades');
        const tituloAtv = document.getElementById('titulo-atividades');
        
        const temTurma = turmas.length > 0;

        // Se não tiver turma, mostra a mensagem de aviso
        if (!temTurma) {
            tituloAtv.innerText = isProfessor ? "Suas Atividades" : "Atividades dos Professores";
            box.innerHTML = `<p style="color: var(--text-muted); line-height: 1.5;">${isProfessor ? 'Crie uma turma para poder adicionar atividades.' : 'Entre em uma turma para poder acessar as atividades do seu professor!'}</p>`;
            return;
        }

        if (isProfessor) {
            tituloAtv.innerText = "Suas Atividades Criadas";
            // Se for professor, adiciona o botão que aciona o modal de criar atividade
            box.innerHTML = `
                <p style="color: var(--text-muted); line-height: 1.5; margin-bottom: 15px;">Você ainda não criou nenhuma atividade para suas turmas.</p>
                <button onclick="document.getElementById('btn-abrir-link').click()" class="btn-primario">+ Criar Nova Atividade</button>
            `;
        } else {
            tituloAtv.innerText = "Atividades dos Professores";
            box.innerHTML = `<p style="color: var(--text-muted); line-height: 1.5;">Seus professores ainda não postaram atividades para esta turma.</p>`;
        }
    }

    // Função geral que chama todas as renderizações
    function renderizarTudo() {
        renderizarTurmas();
        renderizarPessoas();
        renderizarAtividades();
    }

    // Inicia o script
    renderizarTudo();
});