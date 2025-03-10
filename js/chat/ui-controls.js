// UI control functionality
export function toggleMaximize(section) {
    const container = document.getElementById('chat-container').parentElement.parentElement;
    const targetSection = section === 'chat' ? document.getElementById('chat-section') : document.getElementById('output-section');
    const otherSection = section === 'chat' ? document.getElementById('output-section') : document.getElementById('chat-section');
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    const announcement = document.getElementById('announcement-banner');
    const maximizeBtn = targetSection.querySelector('.maximize-btn i');

    // Store original classes and styles before maximizing
    if (!targetSection.classList.contains('maximized')) {
        // Store original classes
        targetSection.dataset.originalClasses = targetSection.className;
        otherSection.dataset.originalClasses = otherSection.className;
        // Store original styles
        targetSection.dataset.originalStyles = targetSection.style.cssText || '';
        otherSection.dataset.originalStyles = otherSection.style.cssText || '';
        // Store container state
        container.dataset.originalStyles = container.style.cssText || '';
        container.dataset.originalClasses = container.className;
    }

    // Toggle classes
    container.classList.toggle('maximized-container');
    const isMaximized = targetSection.classList.toggle('maximized');
    
    // Toggle visibility of other elements
    [nav, footer, announcement].forEach(el => {
        if (el) {
            if (isMaximized) {
                el.dataset.previousDisplay = window.getComputedStyle(el).display;
                el.classList.add('hidden-element');
            } else {
                el.classList.remove('hidden-element');
                el.style.display = el.dataset.previousDisplay || 'block';
                delete el.dataset.previousDisplay;
            }
        }
    });

    // Toggle icon
    maximizeBtn.classList.toggle('fa-expand');
    maximizeBtn.classList.toggle('fa-compress');

    handleMaximizedView(section, targetSection);
}

function handleMaximizedView(section, targetSection) {
    const otherSection = section === 'chat' ? document.getElementById('output-section') : document.getElementById('chat-section');
    const existingToggleBtn = document.querySelector('.toggle-view-btn');
    
    if (targetSection.classList.contains('maximized')) {
        // Save original flex classes
        targetSection.dataset.originalFlex = targetSection.className.match(/lg:w-\[\d+%\]/g)?.join(' ') || '';
        otherSection.dataset.originalFlex = otherSection.className.match(/lg:w-\[\d+%\]/g)?.join(' ') || '';
        
        otherSection.style.display = 'none';
        createToggleButton(section, targetSection, otherSection);
    } else {
        resetView(existingToggleBtn, targetSection, otherSection);
    }
}

function createToggleButton(section, targetSection, otherSection) {
    let existingToggleBtn = document.querySelector('.toggle-view-btn');
    if (existingToggleBtn) {
        existingToggleBtn.remove();
    }
    
    const toggleViewBtn = document.createElement('button');
    toggleViewBtn.className = 'toggle-view-btn';
    toggleViewBtn.dataset.currentSection = section;
    toggleViewBtn.dataset.initialSection = section;
    toggleViewBtn.innerHTML = `Switch to ${section === 'chat' ? 'Output' : 'Chat'}`;
    
    const switchHandler = () => {
        const currentSection = toggleViewBtn.dataset.currentSection;
        const initialSection = toggleViewBtn.dataset.initialSection;
        
        // Get the correct sections based on initial maximized section
        const currentTarget = initialSection === 'chat' ? targetSection : otherSection;
        const currentOther = initialSection === 'chat' ? otherSection : targetSection;
        
        if (currentSection === 'chat') {
            currentTarget.classList.remove('maximized');
            currentOther.classList.add('maximized');
            currentTarget.style.display = 'none';
            currentOther.style.display = 'flex';
            toggleViewBtn.dataset.currentSection = 'content';
            toggleViewBtn.innerHTML = 'Switch to Chat';
        } else {
            currentOther.classList.remove('maximized');
            currentTarget.classList.add('maximized');
            currentOther.style.display = 'none';
            currentTarget.style.display = 'flex';
            toggleViewBtn.dataset.currentSection = 'chat';
            toggleViewBtn.innerHTML = 'Switch to Output';
        }
        
        // Update maximize button icon
        const visibleSection = document.querySelector('.maximized');
        if (visibleSection) {
            const maximizeBtn = visibleSection.querySelector('.maximize-btn i');
            if (maximizeBtn) {
                maximizeBtn.classList.remove('fa-expand');
                maximizeBtn.classList.add('fa-compress');
            }
        }
    };
    
    toggleViewBtn.switchHandler = switchHandler;
    toggleViewBtn.addEventListener('click', switchHandler);
    
    // Add the button to a fixed position in the document body
    document.body.appendChild(toggleViewBtn);
    
    // Store initial state
    targetSection.dataset.initialMaximized = 'true';
    otherSection.dataset.initialMaximized = 'false';
}

function resetView(existingToggleBtn, targetSection, otherSection) {
    // Remove toggle view button
    if (existingToggleBtn) {
        existingToggleBtn.removeEventListener('click', existingToggleBtn.switchHandler);
        existingToggleBtn.remove();
    }
    
    const container = document.getElementById('chat-container').parentElement.parentElement;
    
    // Restore container state
    if (container.dataset.originalStyles) {
        container.style.cssText = container.dataset.originalStyles;
        delete container.dataset.originalStyles;
    }
    if (container.dataset.originalClasses) {
        container.className = container.dataset.originalClasses;
        delete container.dataset.originalClasses;
    }

    // Restore sections
    [targetSection, otherSection].forEach(section => {
        // Restore original classes including flex classes
        if (section.dataset.originalClasses) {
            section.className = section.dataset.originalClasses;
            delete section.dataset.originalClasses;
        }
        if (section.dataset.originalFlex) {
            section.classList.add(...section.dataset.originalFlex.split(' '));
            delete section.dataset.originalFlex;
        }
        
        // Restore original styles
        if (section.dataset.originalStyles) {
            section.style.cssText = section.dataset.originalStyles;
            delete section.dataset.originalStyles;
        } else {
            section.style.cssText = '';
        }
        
        // Remove maximized state
        section.classList.remove('maximized');
        section.style.removeProperty('display');
    });

    // Ensure proper display is set
    targetSection.style.display = 'flex';
    otherSection.style.display = 'flex';
}

export function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const maximizedElement = document.querySelector('.maximized');
            if (maximizedElement) {
                const section = maximizedElement.id === 'chat-section' ? 'chat' : 'content';
                toggleMaximize(section);
            }
        }
    });
}

// Add resizer functionality
export function initializeResizer() {
    const chatSection = document.getElementById('chat-section');
    const outputSection = document.getElementById('output-section');
    
    // Create resizer element
    const resizer = document.createElement('div');
    resizer.className = 'resizer';
    chatSection.appendChild(resizer);

    let isResizing = false;
    let startX;
    let startWidth;
    let containerWidth;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.pageX;
        startWidth = chatSection.offsetWidth;
        containerWidth = chatSection.parentElement.offsetWidth;
        resizer.classList.add('resizing');
        
        // Disable text selection while resizing
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const diffX = e.pageX - startX;
        const newWidth = ((startWidth + diffX) / containerWidth) * 100;
        
        // Limit the width between 30% and 80%
        if (newWidth >= 30 && newWidth <= 80) {
            chatSection.style.width = `${newWidth}%`;
            outputSection.style.width = `${100 - newWidth}%`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove('resizing');
            document.body.style.userSelect = '';
        }
    });
}