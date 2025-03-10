// color-theme.js
import { CONFIG, THEME_CYCLE_INTERVAL } from './config.js';

let autoThemeInterval = null;

export function applyTheme(theme, isAuto = false) {
    if (theme === 'auto') {
        if (autoThemeInterval) {
            clearInterval(autoThemeInterval);
            autoThemeInterval = null;
            document.body.removeAttribute('data-theme-auto');
            const savedTheme = localStorage.getItem('selected-theme') || CONFIG.DEFAULT_THEME;
            applyTheme(savedTheme);
        } else {
            startAutoTheme();
        }
        return;
    }

    if (!isAuto && autoThemeInterval) {
        clearInterval(autoThemeInterval);
        autoThemeInterval = null;
        document.body.removeAttribute('data-theme-auto');
    }

    document.body.classList.add('theme-transition');
    document.body.classList.remove('theme-dark', 'theme-green', 'theme-blue');
    document.body.removeAttribute('data-theme');

    if (theme === 'dark' || theme === 'green' || theme === 'blue') {
        document.body.classList.add(`theme-${theme}`);
    } else {
        document.body.setAttribute('data-theme', theme);
    }

    document.body.classList.add('theme-switch');
    localStorage.setItem('selected-theme', theme);
    updateThemeOptions();

    setTimeout(() => {
        document.body.classList.remove('theme-transition', 'theme-switch');
    }, 500);
}

function startAutoTheme() {
    const themes = [
        'dark', 'dark-2', 'purple', 'blue', 'ocean',
        'sunset', 'rose', 'forest', 'midnight',
        'coral', 'mint', 'amber', 'nordic',
        'sakura', 'cyber', 'autumn'
    ];
    let currentIndex = 0;

    document.body.setAttribute('data-theme-auto', 'true');
    localStorage.setItem('selected-theme', 'auto');
    applyTheme(themes[currentIndex], true);

    autoThemeInterval = setInterval(() => {
        document.body.style.opacity = '0.99';
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % themes.length;
            document.body.classList.add('theme-auto-transition');
            applyTheme(themes[currentIndex], true);
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 500);
        }, 1000);
    }, THEME_CYCLE_INTERVAL);

    updateThemeOptions();
}

export function updateThemeOptions() {
    const currentTheme = localStorage.getItem('selected-theme') || CONFIG.DEFAULT_THEME;
    const options = document.querySelectorAll('.theme-option');
    const isAutoMode = autoThemeInterval !== null;

    options.forEach(option => {
        option.classList.remove('active', 'theme-selected');
        const themeMatch = option.getAttribute('onclick').match(/applyTheme\('(.+?)'\)/);
        const optionTheme = themeMatch ? themeMatch[1] : null;

        if ((isAutoMode && optionTheme === 'auto') || (!isAutoMode && optionTheme === currentTheme)) {
            option.classList.add('active', 'theme-selected');
        }
    });
}