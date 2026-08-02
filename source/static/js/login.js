document.addEventListener('DOMContentLoaded', () => {
    // LOGIN PROFESSOR
    const professorLogin = document.getElementById('login-professor-form');
    if (professorLogin) {
        professorLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'dashboard-professor.html';
        });
    }

    // LOGIN ALUNO
    const alunoLogin = document.getElementById('login-aluno-form');
    if (alunoLogin) {
        alunoLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = '/acc234.v4/pages/dashboards/dashboard-aluno.html';
        });
    }

    
});