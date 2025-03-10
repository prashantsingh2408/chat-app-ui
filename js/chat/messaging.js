// Chat messaging functionality
import { updateOutputSection } from './output-handler.js';

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

function sendMessage(elements) {
    const message = elements.messageInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    
    // Clear input and reset height
    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';
    
    // Simulate bot response
    setTimeout(() => {
        const responses = [
            "I understand. Can you tell me more?",
            "That's interesting! Let me think about that.",
            "Here's what I found in my database...",
            "Let me show you some results in the output section.",
            "I've analyzed your request and have some information for you."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, false);
        updateOutputSection(message);
    }, 1000);
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