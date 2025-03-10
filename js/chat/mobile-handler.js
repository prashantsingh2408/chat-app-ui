// Mobile view handling functionality
export function initializeMobileView(elements) {
    if (elements.mobileToggleBtn && elements.contentWrapper) {
        let isContentVisible = true;
        const toggleIcon = elements.mobileToggleBtn.querySelector('i');
        
        // Handle visibility state
        const handleVisibilityState = (isMaximized) => {
            if (isMaximized) {
                elements.mobileToggleBtn.style.display = 'none';
                elements.contentWrapper.style.maxHeight = '';
                elements.contentWrapper.style.opacity = '1';
                elements.contentWrapper.dataset.previousState = isContentVisible ? 'visible' : 'hidden';
            } else {
                elements.mobileToggleBtn.style.display = '';
                // Restore previous state if it exists
                if (elements.contentWrapper.dataset.previousState) {
                    isContentVisible = elements.contentWrapper.dataset.previousState === 'visible';
                    delete elements.contentWrapper.dataset.previousState;
                }
                updateMobileView(elements, isContentVisible, toggleIcon);
            }
        };

        // Observe maximize state changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isMaximized = mutation.target.classList.contains('maximized');
                    handleVisibilityState(isMaximized);
                }
            });
        });

        observer.observe(elements.outputSection, { attributes: true });
        
        elements.mobileToggleBtn.addEventListener('click', () => {
            if (!elements.outputSection.classList.contains('maximized')) {
                isContentVisible = !isContentVisible;
                updateMobileView(elements, isContentVisible, toggleIcon);
            }
        });
    }

    // Add media query listener
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    mediaQuery.addListener(() => handleMediaChange(mediaQuery, elements));
}

function updateMobileView(elements, isContentVisible, toggleIcon) {
    if (!elements.outputSection.classList.contains('maximized')) {
        // Update content visibility
        elements.contentWrapper.style.maxHeight = isContentVisible ? `${elements.contentWrapper.scrollHeight}px` : '0';
        elements.contentWrapper.style.opacity = isContentVisible ? '1' : '0';
        
        // Update section height
        elements.outputSection.classList.toggle('min-h-[200px]', isContentVisible);
        elements.outputSection.classList.toggle('min-h-[60px]', !isContentVisible);
        
        // Update toggle icon
        if (toggleIcon) {
            toggleIcon.className = isContentVisible ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
        }
    }
}

function handleMediaChange(mediaQuery, elements) {
    if (mediaQuery.matches) {
        // Reset mobile view when switching to desktop
        elements.outputSection.classList.remove('h-screen');
        elements.outputSection.classList.add('min-h-[200px]');
        elements.contentWrapper.style.maxHeight = '';
        elements.contentWrapper.style.opacity = '';
    }
}

export function toggleMaximizeOnMobileView(elements) {
    const MOBILE_BREAKPOINT = 768; // Standard mobile breakpoint
    let isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    // Handle proper mobile detection
    const checkMobile = () => {
        // Use both window width and touch capability check
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        return isTouchDevice && window.innerWidth <= MOBILE_BREAKPOINT;
    };

    const handleViewSwitch = () => {
        const newIsMobile = checkMobile();
        
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            
            if (isMobile) {
                console.log('Mobile view activated');
                elements.outputSection.classList.add('mobile');
                elements.outputSection.dataset.mobile = 'true';
                toggleMaximize('content');
                
                // Force layout update for mobile browsers
                elements.outputSection.style.transform = 'translateZ(0)';
            } else {
                console.log('Desktop view activated');
                elements.outputSection.classList.remove('mobile');
                delete elements.outputSection.dataset.mobile;
                toggleMaximize('content');
                
                // Add slight delay for mobile browser rendering
                setTimeout(() => {
                    elements.contentWrapper.style.transform = 'none';
                }, 100);
            }
        }
    };

    // Initial check
    handleViewSwitch();

    // Add both resize and orientationchange listeners
    const debouncedResize = debounce(handleViewSwitch, 150);
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', debouncedResize);

    // Proper cleanup function
    return () => {
        window.removeEventListener('resize', debouncedResize);
        window.removeEventListener('orientationchange', debouncedResize);
    };
}

// Debounce helper function
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}