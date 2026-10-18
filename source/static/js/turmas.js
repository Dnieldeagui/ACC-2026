// Aguarda o HTML carregar completamente antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // Pega os dados do Python que foram passados via atributos data-* no HTML
    const divDados = document.getElementById('dados-usuario');
    const isProfessor = divDados ? divDados.dataset.professor === 'true' : false;
    const loggedUser = divDados ? divDados.dataset.nome : 'Usuário';

    // Usei o localStorage (memória do navegador)
    // para simular o banco de dados de turmas. Quando o backend estiver pronto,
    // essas variáveis podem ser preenchidas pelo python
    let turmasProf = JSON.parse(localStorage.getItem('octoler_turmas_prof') || '[]');
    let turmasAluno = JSON.parse(localStorage.getItem('octoler_turmas_aluno') || '[]');

    // Função chamada pelo botão "Criar Turma" do professor
    window.profCriarTurma = function(isNova = false) {
        // Pega os valores dos inputs (se for a primeira turma ou uma nova)
        const ano = isNova ? document.getElementById('input-ano-novo').value : document.getElementById('input-ano').value;
        const disciplina = isNova ? document.getElementById('input-disciplina-nova').value : document.getElementById('input-disciplina').value;

        if (!ano || !disciplina) {
            alert("Preencha todos os campos!");
            return;
        }

        // IMPORTANTE: Gera um código de 6 caracteres alfanuméricos aleatórios (podem excluir quando fizerem em python)
        const novaTurma = {
            ano: ano,
            disciplina: disciplina,
            codigo: Math.random().toString(36).substring(2, 8).toUpperCase(),
            professor: loggedUser
        };

        turmasProf.push(novaTurma);
        localStorage.setItem('octoler_turmas_prof', JSON.stringify(turmasProf));
        
        // Limpa os inputs e esconde o formulário após criar
        if (isNova) {
            document.getElementById('input-ano-novo').value = '';
            document.getElementById('input-disciplina-nova').value = '';
            document.getElementById('form-nova-turma-prof').classList.add('hidden');
        } else {
            document.getElementById('input-ano').value = '';
            document.getElementById('input-disciplina').value = '';
        }
        
        renderizarTudo();
    }

    // Função para o aluno tentar entrar em uma turma
    window.alunoEntrarTurma = function(isNova = false) {
        const codigoInput = isNova ? document.getElementById('input-novo-codigo') : document.getElementById('input-codigo-aluno');
        const codigo = codigoInput.value.toUpperCase().trim();

        if (!codigo) return alert("Digite um código!");

        // Verifica se o código existe na lista de turmas do professor
        if (codigo === "ETG9L3" || turmasProf.some(t => t.codigo === codigo)) {
            const turmaEncontrada = turmasProf.find(t => t.codigo === codigo) || {ano: "1º Ano", disciplina: "Artes", codigo: codigo, professor: "Prof. Carlos"};
            
            // Se o aluno já não estiver na turma, adiciona
            if (!turmasAluno.some(t => t.codigo === codigo)) {
                turmasAluno.push(turmaEncontrada);
                localStorage.setItem('octoler_turmas_aluno', JSON.stringify(turmasAluno));
                renderizarTudo();
            } else {
                alert("Você já está nesta turma!");
            }
        } else {
            alert("Turma não encontrada. Verifique o código.");
        }
        codigoInput.value = '';
    }

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

        if (turmasAluno.length > 0) {
            boxAlunoSem.classList.add('hidden');
            boxAlunoCom.classList.remove('hidden');
            
            // Loop para criar o HTML de cada turma do aluno
            turmasAluno.forEach(t => {
                listaAluno.innerHTML += `
                    <div class="turma-card">
                        <div>
                            <strong>${t.ano} - ${t.disciplina}</strong><br>
                            <span style="font-size: 0.9em; color: var(--text-muted);">Prof. ${t.professor}</span>
                        </div>
                        <div class="codigo-turma">${t.codigo}</div>
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

        if (turmasProf.length > 0) {
            boxProfSem.classList.add('hidden');
            boxProfCom.classList.remove('hidden');
            
            // Loop para criar o HTML de cada turma do professor
            turmasProf.forEach(t => {
                listaProf.innerHTML += `
                    <div class="turma-card">
                        <div>
                            <strong>${t.ano} - ${t.disciplina}</strong><br>
                            <span style="font-size: 0.9em; color: var(--text-muted);">Código para os alunos:</span>
                        </div>
                        <div class="codigo-turma">${t.codigo}</div>
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

        const temTurma = isProfessor ? (turmasProf.length > 0) : (turmasAluno.length > 0);
        
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
        
        const temTurma = isProfessor ? (turmasProf.length > 0) : (turmasAluno.length > 0);

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