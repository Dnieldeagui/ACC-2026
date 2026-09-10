document.addEventListener('DOMContentLoaded', () => {
    // Menu de Configurações (Engrenagem)
    const btnSettings = document.getElementById('btn-settings');
    const settingsDropdown = document.getElementById('settings-dropdown');

    btnSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!settingsDropdown.contains(e.target) && !btnSettings.contains(e.target)) {
            settingsDropdown.classList.add('hidden');
        }
    });

    settingsDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Tema (Claro/Escuro)
const themeSwitch = document.querySelector('#checkbox');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark-mode') {
    themeSwitch.checked = true;
}

themeSwitch.addEventListener('change', function(e) {
    if (e.target.checked) {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    }
});

    // Acessibilidade (Dislexia)
    const dyslexiaSwitch = document.querySelector('#dyslexia-checkbox');
    const currentA11y = localStorage.getItem('accessibility');

    if (currentA11y === 'dyslexia-mode') {
        document.body.classList.add('dyslexia-mode');
        dyslexiaSwitch.checked = true;
    }

    dyslexiaSwitch.addEventListener('change', function(e) {
        if (e.target.checked) {
            document.body.classList.add('dyslexia-mode');
            localStorage.setItem('accessibility', 'dyslexia-mode');
        } else {
            document.body.classList.remove('dyslexia-mode');
            localStorage.setItem('accessibility', 'standard-mode');
        }
    });
});