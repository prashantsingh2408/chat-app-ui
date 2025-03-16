// Chat messaging functionality
import { updateOutputSection } from './output-handler.js';

async function callChatApi(message) {
    // Add the message as a query parameter
    // const apiUrl = `http://127.0.0.1:8000/chat_content_api?user_message=${encodeURIComponent(message)}`;
    const apiUrl = `https://content-creator-chat-profile-api.vercel.app/chat_content_api?user_message=${encodeURIComponent(message)}`;
    
    try {
      console.log('Sending request to API:', apiUrl);
      
      const response = await $.ajax({
        url: apiUrl,
        type: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // No data needed since we're using query parameters
        dataType: 'json'
      });
      
      console.log('API Response:', response);
      return response;
      
    } catch (error) {
      console.error('Error calling chat API:', error);
      return { response: "Sorry, I couldn't connect to the API. " + error.message };
    }
  }

export function initializeMessaging(elements) {
    if (elements.sendButton) {
        $(elements.sendButton).on('click', (e) => {
            e.preventDefault();
            sendMessage(elements);
        });
    }
    
    if (elements.messageInput) {
        $(elements.messageInput).on('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(elements);
            }
        });
        
        // Auto-resize textarea
        $(elements.messageInput).on('input', function() {
            $(this).css('height', 'auto');
            $(this).css('height', this.scrollHeight + 'px');
        });
    }
}

async function sendMessage(elements) {
    const message = $(elements.messageInput).val().trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input and reset height
    $(elements.messageInput).val('');
    $(elements.messageInput).css('height', 'auto');
    
    // Show loading indicator
    const $loadingDiv = $('<div>')
        .addClass('bg-blue-50 p-3 rounded-lg max-w-xs message-appear')
        .html('<p class="text-sm text-gray-600">Thinking...</p>');
    
    const $chatMessages = $('#chat-section .overflow-y-auto');
    $chatMessages.append($loadingDiv);
    $chatMessages.scrollTop($chatMessages[0].scrollHeight);
    
    try {
        // Call the API instead of using the random responses
        const apiResponse = await callChatApi(message);
        
        // Remove loading indicator
        $loadingDiv.remove();
        
        // Add bot response from API
        const botResponse = apiResponse.response || apiResponse.message || JSON.stringify(apiResponse);
        addMessage(botResponse, false);
        
        // Update output section
        updateOutputSection(message, botResponse);
    } catch (error) {
        // Remove loading indicator
        $loadingDiv.remove();
        
        // Add error message
        addMessage("Sorry, I couldn't process your request. Please try again.", false);
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