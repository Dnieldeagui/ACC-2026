document.addEventListener('DOMContentLoaded', () => {
    // LOGIN PROFESSOR
    const professorLogin = document.getElementById('login-professor-form');
    if (professorLogin) {
        professorLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = '/pages/dashboards/dashboard-professor.html';
        });
    }

    // LOGIN ALUNO
    const alunoLogin = document.getElementById('login-aluno-form');
    if (alunoLogin) {
        alunoLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = '/pages/dashboards/dashboard-aluno.html';
        });
    }

    // CADASTRO PROFESSOR
    const professorCadastro = document.getElementById('cadastro-professor-form');
    if (professorCadastro) {
        professorCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            // redireciona para o dashboard (já logado)
            window.location.href = 'dashboard-professor.html';
        });
    }

    // CADASTRO ALUNO
    const alunoCadastro = document.getElementById('cadastro-aluno-form');
    if (alunoCadastro) {
        alunoCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = '/pages/dashboards/dashboard-aluno.html';
        });
    }
});