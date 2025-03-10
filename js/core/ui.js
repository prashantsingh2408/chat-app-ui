// ui.js
export function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

export function toggleThemeDropdown() {
    const dropdown = document.getElementById('theme-dropdown');
    dropdown.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('theme-dropdown');
    const themeButton = event.target.closest('.theme-btn');

    if (!themeButton && !event.target.closest('#theme-dropdown')) {
        dropdown.classList.add('hidden');
    }
});

// Add hover effect for the main theme button
const themeButton = document.querySelector('.theme-btn');
if (themeButton) {
    themeButton.addEventListener('mouseover', function() {
        this.querySelector('i').style.transform = 'rotate(180deg)';
    });

    themeButton.addEventListener('mouseout', function() {
        this.querySelector('i').style.transform = 'rotate(0deg)';
    });
}