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
  var { chatMessage, contentMessage } = splitMessage(botResponse);
  chatMessage = extractLastBotMessage(chatMessage);
  console.log("chat message new",chatMessage);
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

/**
 * Extracts the last BOT message from a chat conversation
 * @param {string} chatContent - The chat content containing USER and BOT messages
 * @returns {string} - The last BOT message without the "BOT:" prefix
 */
function extractLastBotMessage(chatContent) {
  // First remove any </CHAT> tags that might be included
  chatContent = chatContent.replace(/<\/CHAT>/g, '');
  
  // Regular expression to find all BOT messages
  // This matches "BOT:" followed by any text until the next "USER:", "BOT:", or end of string
  const botMessagesRegex = /BOT:\s*(.*?)(?=\s*(?:USER:|BOT:|$))/gs;
  
  // Find all matches of BOT messages
  const botMessages = [...chatContent.matchAll(botMessagesRegex)];
  
  // If any BOT messages were found
  if (botMessages.length > 0) {
      // Return the last BOT message (capture group 1) without the "BOT:" prefix, trimmed
      return cleanBotMessage(botMessages[botMessages.length - 1][1].trim());
  }
  
  // Return empty string if no BOT messages found
  return '';
}

/**
 * Extracts and cleans the last BOT message from a chat conversation
 * @param {string} input - Raw input that may contain a BOT message and closing CHAT tags
 * @returns {string} - The cleaned BOT message
 */
function cleanBotMessage(input) {
  // First check if this is a BOT message with the closing tag
  if (input.includes('</CHAT>')) {
      // Remove the closing </CHAT> tag and any surrounding whitespace
      return input.replace(/\s*<\/CHAT>\s*$/, '').trim();
  }
  
  // If input contains BOT: prefix, extract just the message part
  if (input.startsWith('BOT:')) {
      return input.substring(4).trim();
  }
  
  // Otherwise, just return the cleaned input
  return input.trim();
}