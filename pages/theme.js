/**
 * theme.js — Tema, Acessibilidade e Configurações
 * Versão robusta: funciona em todas as páginas (com ou sem todos os toggles)
 */
document.addEventListener('DOMContentLoaded', () => {

    /* ── Menu de Configurações (Engrenagem) ── */
    const btnSettings      = document.getElementById('btn-settings');
    const settingsDropdown = document.getElementById('settings-dropdown');

    if (btnSettings && settingsDropdown) {
        btnSettings.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!settingsDropdown.contains(e.target) && !btnSettings.contains(e.target)) {
                settingsDropdown.classList.add('hidden');
            }
        });

        settingsDropdown.addEventListener('click', (e) => e.stopPropagation());
    }

    /* ── Tema Claro / Escuro ── */
    const themeSwitch  = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (themeSwitch && currentTheme === 'dark-mode') themeSwitch.checked = true;
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }

    /* ── Acessibilidade — Fonte para Dislexia ── */
    const dyslexiaSwitch = document.querySelector('#dyslexia-checkbox');
    const currentA11y    = localStorage.getItem('accessibility');

    if (currentA11y === 'dyslexia-mode') {
        document.body.classList.add('dyslexia-mode');
        if (dyslexiaSwitch) dyslexiaSwitch.checked = true;
    }

    if (dyslexiaSwitch) {
        dyslexiaSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dyslexia-mode');
                localStorage.setItem('accessibility', 'dyslexia-mode');
            } else {
                document.body.classList.remove('dyslexia-mode');
                localStorage.setItem('accessibility', 'standard-mode');
            }
        });
    }

    /* ── Transição suave entre páginas ── */
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http')) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.25s ease';
            setTimeout(() => { window.location.href = href; }, 260);
        });
    });

    /* ── Fade-in ao carregar ── */
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
