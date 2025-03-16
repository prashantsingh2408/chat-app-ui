// Function to extract chat and content parts from a combined message string
function splitMessage(message) {
  const chatRegex = /<CHAT>([\s\S]*?)<\/CHAT>/i;
  const contentRegex = /<CONTENT>([\s\S]*?)<\/CONTENT>/i;
  
  const chatMatch = message.match(chatRegex);
  const contentMatch = message.match(contentRegex);
  
  const chatMessage = chatMatch[0];
  const contentMessage = contentMatch[0];
  
  return { chatMessage, contentMessage };
}

// Update output sections by splitting the message and updating each section
export function updateOutputSection(message, botResponse) {
  // Split the combined message into chat and profile (content) parts
  const { chatMessage, contentMessage } = splitMessage(botResponse);
  console.log(chatMessage);
  console.log(contentMessage);
  
  // Using jQuery to select elements instead of querySelector
  const $outputCanvas = $('#output-section .border-dashed');
  
  // Pass the chat part to the canvas and the profile part to the info section
  updateCanvas($outputCanvas, contentMessage);
  addMessage(chatMessage, false);
}

function updateCanvas($outputCanvas, message) {
  if ($outputCanvas.length) {
      $outputCanvas.html(`${message}`);
  }
}

export function addMessage(text, isUser) {
  const $chatMessages = $('#chat-section .overflow-y-auto');
  const $messageDiv = $('<div>')
      .addClass(isUser
          ? 'bg-gray-100 p-3 rounded-lg max-w-xs ml-auto message-appear'
          : 'bg-blue-50 p-3 rounded-lg max-w-xs message-appear');
  
  const $messageText = $('<p>')
      .addClass('text-sm text-gray-800')
      .text(text);
  
  $messageDiv.append($messageText);
  $chatMessages.append($messageDiv);
  
  // Scroll to bottom
  $chatMessages.scrollTop($chatMessages[0].scrollHeight);
}