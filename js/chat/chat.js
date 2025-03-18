import { initializeMessaging } from './messaging.js';
import { toggleMaximize, initializeKeyboardShortcuts, initializeResizer } from './ui-controls.js';
import { initializeMobileView, toggleMaximizeOnMobileView } from './mobile-handler.js';

// Main chat initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    const elements = {
        container: document.getElementById('chat-container'),
        chatSection: document.getElementById('chat-section'),
        outputSection: document.getElementById('output-section'),
        mobileToggleBtn: document.getElementById('mobile-toggle'),
        contentWrapper: document.getElementById('content-wrapper'),
        messageInput: document.getElementById('message-input-submit'),
        sendButton: document.querySelector('button[type="submit"]')
    };

    // Initialize all chat components
    initializeChat(elements);
});

function initializeChat(elements) {
    // Initialize messaging functionality
    initializeMessaging(elements);
    
    // Initialize mobile view
    initializeMobileView(elements);

    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();

    initializeResizer();
    
    toggleMaximizeOnMobileView(elements);
}

// Expose necessary functions to global scope
window.toggleMaximize = toggleMaximize;