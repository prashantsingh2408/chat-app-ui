// Mobile view handling functionality
export function initializeMobileView(elements) {
    if (elements.mobileToggleBtn && elements.contentWrapper) {
        let isContentVisible = true;
        const $toggleIcon = $(elements.mobileToggleBtn).find('i');
        
        // Handle visibility state
        const handleVisibilityState = (isMaximized) => {
            if (isMaximized) {
                $(elements.mobileToggleBtn).hide();
                $(elements.contentWrapper).css({
                    'maxHeight': '',
                    'opacity': '1'
                });
                $(elements.contentWrapper).data('previousState', isContentVisible ? 'visible' : 'hidden');
            } else {
                $(elements.mobileToggleBtn).show();
                // Restore previous state if it exists
                if ($(elements.contentWrapper).data('previousState')) {
                    isContentVisible = $(elements.contentWrapper).data('previousState') === 'visible';
                    $(elements.contentWrapper).removeData('previousState');
                }
                updateMobileView(elements, isContentVisible, $toggleIcon);
            }
        };

        // Observe maximize state changes
        const observer = new MutationObserver((mutations) => {
            $.each(mutations, (i, mutation) => {
                if (mutation.attributeName === 'class') {
                    const isMaximized = $(mutation.target).hasClass('maximized');
                    handleVisibilityState(isMaximized);
                }
            });
        });

        observer.observe(elements.outputSection, { attributes: true });
        
        $(elements.mobileToggleBtn).on('click', () => {
            if (!$(elements.outputSection).hasClass('maximized')) {
                isContentVisible = !isContentVisible;
                updateMobileView(elements, isContentVisible, $toggleIcon);
            }
        });
    }

    // Add media query listener
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    mediaQuery.addListener(() => handleMediaChange(mediaQuery, elements));
}

function updateMobileView(elements, isContentVisible, $toggleIcon) {
    if (!$(elements.outputSection).hasClass('maximized')) {
        // Update content visibility
        $(elements.contentWrapper).css({
            'maxHeight': isContentVisible ? `${$(elements.contentWrapper)[0].scrollHeight}px` : '0',
            'opacity': isContentVisible ? '1' : '0'
        });
        
        // Update section height
        if (isContentVisible) {
            $(elements.outputSection).addClass('min-h-[200px]').removeClass('min-h-[60px]');
        } else {
            $(elements.outputSection).addClass('min-h-[60px]').removeClass('min-h-[200px]');
        }
        
        // Update toggle icon
        if ($toggleIcon.length) {
            $toggleIcon.attr('class', isContentVisible ? 'fas fa-chevron-up' : 'fas fa-chevron-down');
        }
    }
}

function handleMediaChange(mediaQuery, elements) {
    if (mediaQuery.matches) {
        // Reset mobile view when switching to desktop
        $(elements.outputSection).removeClass('h-screen').addClass('min-h-[200px]');
        $(elements.contentWrapper).css({
            'maxHeight': '',
            'opacity': ''
        });
    }
}

export function toggleMaximizeOnMobileView(elements) {
    const MOBILE_BREAKPOINT = 768; // Standard mobile breakpoint
    let isMobile = $(window).width() <= MOBILE_BREAKPOINT;

    // Handle proper mobile detection
    const checkMobile = () => {
        // Use both window width and touch capability check
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        return isTouchDevice && $(window).width() <= MOBILE_BREAKPOINT;
    };

    const handleViewSwitch = () => {
        const newIsMobile = checkMobile();
        
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            
            if (isMobile) {
                console.log('Mobile view activated');
                $(elements.outputSection).addClass('mobile').data('mobile', 'true');
                toggleMaximize('content');
                
                // Force layout update for mobile browsers
                $(elements.outputSection).css('transform', 'translateZ(0)');
            } else {
                console.log('Desktop view activated');
                $(elements.outputSection).removeClass('mobile').removeData('mobile');
                toggleMaximize('content');
                
                // Add slight delay for mobile browser rendering
                setTimeout(() => {
                    $(elements.contentWrapper).css('transform', 'none');
                }, 100);
            }
        }
    };

    // Initial check
    handleViewSwitch();

    // Add both resize and orientationchange listeners
    const debouncedResize = debounce(handleViewSwitch, 150);
    $(window).on('resize', debouncedResize);
    $(window).on('orientationchange', debouncedResize);

    // Proper cleanup function
    return () => {
        $(window).off('resize', debouncedResize);
        $(window).off('orientationchange', debouncedResize);
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