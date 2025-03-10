function togglePopup(e) {
    e.preventDefault();
    const popup = document.getElementById('info-popup');
    popup.classList.toggle('hidden');
}
// Close popup when clicking outside
document.addEventListener('click', (e) => {
    const popup = document.getElementById('info-popup');
    if (!e.target.closest('a') && !popup.classList.contains('hidden')) {
        popup.classList.add('hidden');
    }
});