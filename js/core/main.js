// main.js
import { CONFIG } from '../core/config.js';
import { applyTheme } from '../core/color-theme.js';
import { toggleMenu, toggleThemeDropdown } from '../core/ui.js';
import { toggleRainEffect } from '../rain.js';

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selected-theme') || CONFIG.DEFAULT_THEME;
    applyTheme(savedTheme);
});

// Expose functions globally for use in HTML event handlers
window.applyTheme = applyTheme;
window.toggleMenu = toggleMenu;
window.toggleThemeDropdown = toggleThemeDropdown;
window.toggleRainEffect = toggleRainEffect; 