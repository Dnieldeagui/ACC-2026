document.addEventListener('DOMContentLoaded', () => {
    // LOGIN PROFESSOR
    const professorLogin = document.getElementById('login-professor-form');
    if (professorLogin) {
        professorLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            OctolerAuth.login('professor');
            window.location.href = '/dashboard/professor';
        });
    }

    // LOGIN ALUNO
    const alunoLogin = document.getElementById('login-aluno-form');
    if (alunoLogin) {
        alunoLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            OctolerAuth.login('aluno');
            window.location.href = '/dashboard/aluno';
        });
    }

    // CADASTRO PROFESSOR
    const professorCadastro = document.getElementById('cadastro-professor-form');
    if (professorCadastro) {
        professorCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            OctolerAuth.login('professor');
            window.location.href = '/dashboard/professor';
        });
    }

    // CADASTRO ALUNO
    const alunoCadastro = document.getElementById('cadastro-aluno-form');
    if (alunoCadastro) {
        alunoCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            OctolerAuth.login('aluno');
            window.location.href = '/dashboard/aluno';
        });
    }
});