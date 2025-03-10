// rain.js
let rainEffect = null;

export function toggleRainEffect() {
    const rainStatus = document.querySelector('.rain-status');
    if (!rainEffect) {
        rainEffect = new RainEffect();
        rainStatus.classList.remove('hidden');
    } else {
        rainEffect.toggle();
        rainStatus.classList.toggle('hidden', !rainEffect.isActive);
    }
}