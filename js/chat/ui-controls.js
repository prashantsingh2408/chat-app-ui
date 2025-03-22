// UI control functionality
export function toggleMaximize(section) {
    const $container = $('#chat-container').parent().parent();
    const $targetSection = section === 'chat' ? $('#chat-section') : $('#output-section');
    const $otherSection = section === 'chat' ? $('#output-section') : $('#chat-section');
    const $nav = $('nav');
    const $footer = $('footer');
    const $announcement = $('#announcement-banner');
    const $maximizeBtn = $targetSection.find('.maximize-btn i');

    // Store original classes and styles before maximizing
    if (!$targetSection.hasClass('maximized')) {
        // Store original classes
        $targetSection.data('originalClasses', $targetSection.attr('class'));
        $otherSection.data('originalClasses', $otherSection.attr('class'));
        // Store original styles
        $targetSection.data('originalStyles', $targetSection.attr('style') || '');
        $otherSection.data('originalStyles', $otherSection.attr('style') || '');
        // Store container state
        $container.data('originalStyles', $container.attr('style') || '');
        $container.data('originalClasses', $container.attr('class'));
    }

    // Toggle classes
    $container.toggleClass('maximized-container');
    const isMaximized = $targetSection.toggleClass('maximized').hasClass('maximized');
    
    // Toggle visibility of other elements
    $.each([$nav, $footer, $announcement], function(_, $el) {
        if ($el.length) {
            if (isMaximized) {
                $el.data('previousDisplay', $el.css('display'));
                $el.addClass('hidden-element');
            } else {
                $el.removeClass('hidden-element');
                $el.css('display', $el.data('previousDisplay') || 'block');
                $el.removeData('previousDisplay');
            }
        }
    });

    // Toggle icon
    $maximizeBtn.toggleClass('fa-expand fa-compress');

    handleMaximizedView(section, $targetSection);
}

function handleMaximizedView(section, $targetSection) {
    const $otherSection = section === 'chat' ? $('#output-section') : $('#chat-section');
    const $existingToggleBtn = $('.toggle-view-btn');
    
    if ($targetSection.hasClass('maximized')) {
        // Save original flex classes
        const originalFlex = ($targetSection.attr('class').match(/lg:w-\[\d+%\]/g) || []).join(' ');
        const otherOriginalFlex = ($otherSection.attr('class').match(/lg:w-\[\d+%\]/g) || []).join(' ');
        
        $targetSection.data('originalFlex', originalFlex);
        $otherSection.data('originalFlex', otherOriginalFlex);
        
        $otherSection.hide();
        createToggleButton(section, $targetSection, $otherSection);
    } else {
        resetView($existingToggleBtn, $targetSection, $otherSection);
    }
}

function createToggleButton(section, $targetSection, $otherSection) {
    let $existingToggleBtn = $('.toggle-view-btn');
    if ($existingToggleBtn.length) {
        $existingToggleBtn.remove();
    }
    
    const $toggleViewBtn = $('<button></button>')
    .addClass('toggle-view-btn absolute top-2 right-2 w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 bg-[var(--bg-color)] border border-white shadow-md flex items-center justify-center text-black')

    .data('currentSection', section)
        .data('initialSection', section)
        .html(`<i class="fas ${section === 'chat' ? 'fa-eye' : 'fa-comment'}"></i>`);
    
    const switchHandler = function() {
        const currentSection = $toggleViewBtn.data('currentSection');
        const initialSection = $toggleViewBtn.data('initialSection');
        
        const $currentTarget = initialSection === 'chat' ? $targetSection : $otherSection;
        const $currentOther = initialSection === 'chat' ? $otherSection : $targetSection;
        
        if (currentSection === 'chat') {
            $currentTarget.removeClass('maximized');
            $currentOther.addClass('maximized');
            $currentTarget.hide();
            $currentOther.css('display', 'flex');
            $toggleViewBtn.data('currentSection', 'content');
            $toggleViewBtn.html('<i class="fas fa-comment"></i>'); // Chat icon
        } else {
            $currentOther.removeClass('maximized');
            $currentTarget.addClass('maximized');
            $currentOther.hide();
            $currentTarget.css('display', 'flex');
            $toggleViewBtn.data('currentSection', 'chat');
            $toggleViewBtn.html('<i class="fas fa-eye"></i>'); // Eye icon for output
        }
    };
    
    $toggleViewBtn.data('switchHandler', switchHandler);
    $toggleViewBtn.on('click', switchHandler);
    
    $('body').append($toggleViewBtn);
    createMaximizeToggleButton(section);
    $targetSection.data('initialMaximized', true);
    $otherSection.data('initialMaximized', false);
}

function createMaximizeToggleButton(section) {
    console.log(section)
    const $maximizeBtn = $('<button></button>')
    .addClass('toggle-view-btn absolute top-2 right-12 w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 bg-[var(--bg-color)] border border-white shadow-md flex items-center justify-center text-black')
    .attr('onclick', `toggleMaximize('chat')`)
    .html('<i class="fas fa-expand"></i>');
    $('body').append($maximizeBtn);
}
    

function resetView($existingToggleBtn, $targetSection, $otherSection) {
    // Remove toggle view button
    if ($existingToggleBtn.length) {
        $existingToggleBtn.off('click', $existingToggleBtn.data('switchHandler'));
        $existingToggleBtn.remove();
    }
    
    const $container = $('#chat-container').parent().parent();
    
    // Restore container state
    if ($container.data('originalStyles')) {
        $container.attr('style', $container.data('originalStyles'));
        $container.removeData('originalStyles');
    }
    if ($container.data('originalClasses')) {
        $container.attr('class', $container.data('originalClasses'));
        $container.removeData('originalClasses');
    }

    // Restore sections
    $.each([$targetSection, $otherSection], function(_, $section) {
        // Restore original classes including flex classes
        if ($section.data('originalClasses')) {
            $section.attr('class', $section.data('originalClasses'));
            $section.removeData('originalClasses');
        }
        if ($section.data('originalFlex')) {
            $.each($section.data('originalFlex').split(' '), function(_, cls) {
                $section.addClass(cls);
            });
            $section.removeData('originalFlex');
        }
        
        // Restore original styles
        if ($section.data('originalStyles')) {
            $section.attr('style', $section.data('originalStyles'));
            $section.removeData('originalStyles');
        } else {
            $section.attr('style', '');
        }
        
        // Remove maximized state
        $section.removeClass('maximized');
        $section.css('display', '');
    });

    // Ensure proper display is set
    $targetSection.css('display', 'flex');
    $otherSection.css('display', 'flex');
}

export function initializeKeyboardShortcuts() {
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            const $maximizedElement = $('.maximized');
            if ($maximizedElement.length) {
                const section = $maximizedElement.attr('id') === 'chat-section' ? 'chat' : 'content';
                toggleMaximize(section);
            }
        }
    });
}

// Add resizer functionality
export function initializeResizer() {
    const $chatSection = $('#chat-section');
    const $outputSection = $('#output-section');
    
    // Create resizer element
    const $resizer = $('<div></div>').addClass('resizer');
    $chatSection.append($resizer);

    let isResizing = false;
    let startX;
    let startWidth;
    let containerWidth;

    $resizer.on('mousedown', function(e) {
        isResizing = true;
        startX = e.pageX;
        startWidth = $chatSection.width();
        containerWidth = $chatSection.parent().width();
        $resizer.addClass('resizing');
        
        // Disable text selection while resizing
        $('body').css('user-select', 'none');
    });

    $(document).on('mousemove', function(e) {
        if (!isResizing) return;

        const diffX = e.pageX - startX;
        const newWidth = ((startWidth + diffX) / containerWidth) * 100;
        
        // Limit the width between 30% and 80%
        if (newWidth >= 30 && newWidth <= 80) {
            $chatSection.css('width', `${newWidth}%`);
            $outputSection.css('width', `${100 - newWidth}%`);
        }
    });

    $(document).on('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            $resizer.removeClass('resizing');
            $('body').css('user-select', '');
        }
    });
}