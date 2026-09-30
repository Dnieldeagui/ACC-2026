
/**LEMBRETE  Quando o backend estiver pronto:
trocar  o login()/estaLogado() pelas verdadeiras chamadas
 */

const OctolerAuth = (function () {
    const CHAVE_SESSAO = 'octoler_sessao';

    function login(tipo) {
        const sessao = { logado: true, tipo: tipo, criadoEm: Date.now() };
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    }

    function logout() {
        localStorage.removeItem(CHAVE_SESSAO);
        window.location.href = '/pages/home.html';
    }

    function getSessao() {
        try {
            const bruto = localStorage.getItem(CHAVE_SESSAO);
            return bruto ? JSON.parse(bruto) : null;
        } catch (e) {
            return null;
        }
    }

    function estaLogado(tipoExigido) {
        const sessao = getSessao();
        if (!sessao || sessao.logado !== true) return false;
        if (tipoExigido && sessao.tipo !== tipoExigido) return false;
        return true;
    }

    return { login, logout, getSessao, estaLogado };
})();