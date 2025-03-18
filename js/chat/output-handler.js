// Function to extract chat and content parts from a combined message string
function splitMessage(message) {
  const chatRegex = /<CHAT>([\s\S]*?)<\/CHAT>/i;
  const contentRegex = /<CONTENT>([\s\S]*?)<\/CONTENT>/i;

  const chatMatch = message.match(chatRegex);
  const contentMatch = message.match(contentRegex);

  if (!chatMatch && !contentMatch) {
    console.log("No chat/content found, returning message:", message);
    return { chatMessage: message, contentMessage: message };  
  }

  // Extract only content inside the tags
  let chatMessage = chatMatch ? chatMatch[1] : null;
  let contentMessage = contentMatch ? contentMatch[1] : null;

  console.log("Chat Message (before extraction):", chatMessage || "No chat found");
  console.log("Content Message:", contentMessage || "No content found");

  // Extract only last BOT message if chat exists
  chatMessage = chatMessage ? extractLastBotMessage(chatMessage) : '';

  console.log("Chat Message (after extraction):", chatMessage || "No bot message found");

  return { chatMessage, contentMessage };
}

// Update output sections by splitting the message and updating each section
export function updateOutputSection(message, botResponse) {
  var { chatMessage, contentMessage } = splitMessage(botResponse);
  
  console.log("Final Chat Message:", chatMessage);
  console.log("Final Content Message:", contentMessage);
  
  // Using jQuery to select elements instead of querySelector
  const $outputCanvas = $('#output-section .border-dashed');
  
  updateCanvas($outputCanvas, contentMessage);
  addMessage(chatMessage, false);
}

function updateCanvas($canvas, message) {
  $canvas.html('');

  const formattedContent = `
        <p class="text-gray-600 whitespace-pre-wrap break-words">${message}</p>
  `;

  $canvas.append(formattedContent);
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
  
  $chatMessages.scrollTop($chatMessages[0].scrollHeight);
}

/**
 * Extracts the last BOT message from a chat conversation
 * @param {string} chatContent - The chat content containing USER and BOT messages
 * @returns {string} - The last BOT message without the "BOT:" prefix
 */
function extractLastBotMessage(chatContent) {
  if (!chatContent) return '';

  chatContent = chatContent.replace(/<\/CHAT>/g, '');

  console.log("Extracting last BOT message from:", chatContent);
  
  const botMessagesRegex = /BOT:\s*(.*?)(?=\s*(?:USER:|BOT:|$))/gs;
  
  const botMessages = [...chatContent.matchAll(botMessagesRegex)];

  if (botMessages.length > 0) {
      return botMessages[botMessages.length - 1][1].trim();
  }
  
  return '';
}
