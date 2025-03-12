// Chat messaging functionality
import { updateOutputSection } from './output-handler.js';

async function callChatApi(message) {
    // Add the message as a query parameter
    // const apiUrl = `http://127.0.0.1:8000/chat_content_api?user_message=${encodeURIComponent(message)}`;
    const apiUrl = `https://content-creator-chat-profile-api.vercel.app/chat_content_api?user_message=${encodeURIComponent(message)}`;
    
    try {
      console.log('Sending request to API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        // No body needed since we're using query parameters
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error details:', errorText);
        throw new Error(`API error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      return data;
      
    } catch (error) {
      console.error('Error calling chat API:', error);
      return { response: "Sorry, I couldn't connect to the API. " + error.message };
    }
  }

export function initializeMessaging(elements) {
    if (elements.sendButton) {
        elements.sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            sendMessage(elements);
        });
    }
    
    if (elements.messageInput) {
        elements.messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(elements);
            }
        });
        
        // Auto-resize textarea
        elements.messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
}

async function sendMessage(elements) {
    const message = elements.messageInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input and reset height
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';
    
    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'bg-blue-50 p-3 rounded-lg max-w-xs message-appear';
    loadingDiv.innerHTML = '<p class="text-sm text-gray-600">Thinking...</p>';
    
    const chatMessages = document.querySelector('#chat-section .overflow-y-auto');
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        // Call the API instead of using the random responses
        const apiResponse = await callChatApi(message);
        
        // Remove loading indicator
        chatMessages.removeChild(loadingDiv);
        
        // Add bot response from API
        const botResponse = apiResponse.response || apiResponse.message || JSON.stringify(apiResponse);
        addMessage(botResponse, false);
        
        // Update output section
        updateOutputSection(message, botResponse);
    } catch (error) {
        // Remove loading indicator
        chatMessages.removeChild(loadingDiv);
        
        // Add error message
        addMessage("Sorry, I couldn't process your request. Please try again.", false);
    }
}

export function addMessage(text, isUser) {
    const chatMessages = document.querySelector('#chat-section .overflow-y-auto');
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser
        ? 'bg-gray-100 p-3 rounded-lg max-w-xs ml-auto message-appear'
        : 'bg-blue-50 p-3 rounded-lg max-w-xs message-appear';
    
    const messageText = document.createElement('p');
    messageText.className = 'text-sm text-gray-800';
    messageText.textContent = text;
    
    messageDiv.appendChild(messageText);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}