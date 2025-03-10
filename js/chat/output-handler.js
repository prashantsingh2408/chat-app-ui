// Output section handling functionality
export function updateOutputSection(message) {
    const outputCanvas = document.querySelector('#output-section .border-dashed');
    const outputInfo = document.querySelector('#output-section .bg-white:last-child p');
    
    updateCanvas(outputCanvas, message);
    updateInfo(outputInfo, message);
}

function updateCanvas(outputCanvas, message) {
    if (outputCanvas) {
        outputCanvas.innerHTML = `<div class="p-4">
            <p class="font-medium text-gray-700">Processing: "${message}"</p>
            <div class="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full w-3/4"></div>
            </div>
        </div>`;
    }
}

function updateInfo(outputInfo, message) {
    if (outputInfo) {
        outputInfo.textContent = `Analysis complete for: "${message}". Results shown in the canvas above.`;
    }
}