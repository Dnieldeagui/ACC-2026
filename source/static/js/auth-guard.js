(function () {
    const tipoExigido = document.currentScript
        ? document.currentScript.getAttribute('data-tipo')
        : null;

    if (typeof OctolerAuth === 'undefined') {
        window.location.replace('/pages/home.html');
        return;
    }

    if (!OctolerAuth.estaLogado(tipoExigido)) {
        const destino = tipoExigido === 'professor'
            ? '/pages/login/login-professor.html'
            : '/pages/login/login-aluno.html';
        window.location.replace(destino + '?acesso=negado');
    }
})();