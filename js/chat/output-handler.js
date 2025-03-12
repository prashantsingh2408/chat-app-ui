// Function to extract chat and content parts from a combined message string
function splitMessage(message) {
    const chatRegex = /<CHAT>([\s\S]*?)<\/CHAT>/i;
    const contentRegex = /<CONTENT>([\s\S]*?)<\/CONTENT>/i;
    
    const chatMatch = message.match(chatRegex);
    const contentMatch = message.match(contentRegex);
    
    const chatMessage = chatMatch ? chatMatch[1].trim() : "";
    const contentMessage = contentMatch ? contentMatch[1].trim() : "";
    console.log("chatMatch:", chatMatch);
    console.log("contentMatch:", contentMatch);
    
    return { chatMessage, contentMessage };
  }
  
  
  // Update output sections by splitting the message and updating each section
  export function updateOutputSection(message,botResponse) {
    // Split the combined message into chat and profile (content) parts
    const { chatMessage, contentMessage } = splitMessage(botResponse);
    
    const outputCanvas = document.querySelector('#output-section .border-dashed');
    const outputInfo = document.querySelector('#output-section .bg-white:last-child p');
    
    // Pass the chat part to the canvas and the profile part to the info section
    updateCanvas(outputCanvas, chatMessage);
    updateInfo(outputInfo, contentMessage);
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