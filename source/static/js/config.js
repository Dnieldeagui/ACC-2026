document.addEventListener('DOMContentLoaded', () => {
    // 1. Controle do Menu de Configurações (Engrenagem)
    const btnSettings = document.getElementById('btn-settings');
    const settingsDropdown = document.getElementById('settings-dropdown');

    if (btnSettings && settingsDropdown) {
        // Abre e fecha ao clicar na engrenagem
        btnSettings.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            settingsDropdown.classList.toggle('hidden');
        });

        // Fecha se clicar fora
        document.addEventListener('click', (e) => {
            if (!settingsDropdown.contains(e.target) && !btnSettings.contains(e.target)) {
                settingsDropdown.classList.add('hidden');
            }
        });

        // Impede que o menu feche se clicar dentro dele
        settingsDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 2. Controle do Tema (Claro/Escuro)
    const themeSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (themeSwitch) {
        if (currentTheme === 'dark-mode') {
            themeSwitch.checked = true;
        }

        themeSwitch.addEventListener('change', function(e) {
            if (e.target.checked) {
                document.documentElement.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }

    // 3. Controle de Acessibilidade (Dislexia)
    const dyslexiaSwitch = document.querySelector('#dyslexia-checkbox');
    const currentA11y = localStorage.getItem('accessibility');

    if (dyslexiaSwitch) {
        if (currentA11y === 'dyslexia-mode') {
            document.documentElement.classList.add('dyslexia-mode');
            dyslexiaSwitch.checked = true;
        }

        dyslexiaSwitch.addEventListener('change', function(e) {
            if (e.target.checked) {
                document.documentElement.classList.add('dyslexia-mode');
                localStorage.setItem('accessibility', 'dyslexia-mode');
            } else {
                document.documentElement.classList.remove('dyslexia-mode');
                localStorage.setItem('accessibility', 'standard-mode');
            }
        });
    }
});