document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const featureItems = document.querySelectorAll('.feature-item');
    const highlightPill = document.querySelector('.highlight-pill');
    
    // Check if device supports hover
    const hasHover = window.matchMedia('(hover: hover)').matches;

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.documentElement.setAttribute(
            'data-theme',
            document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        );
        sunIcon.classList.toggle('hidden');
        moonIcon.classList.toggle('hidden');
    });

    // Only add hover effects if device supports hover
    if (hasHover) {
        featureItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const rect = item.getBoundingClientRect();
                const containerRect = item.parentElement.getBoundingClientRect();
                
                requestAnimationFrame(() => {
                    highlightPill.style.top = `${rect.top - containerRect.top}px`;
                    highlightPill.style.left = `${rect.left - containerRect.left}px`;
                    highlightPill.style.width = `${rect.width}px`;
                    highlightPill.style.height = `${rect.height}px`;
                    highlightPill.style.opacity = '1';
                });
            });

            item.addEventListener('mouseleave', () => {
                highlightPill.style.opacity = '0';
            });
        });

        // Update highlight pill position on resize
        window.addEventListener('resize', () => {
            if (document.querySelector('.feature-item:hover')) {
                const hoveredItem = document.querySelector('.feature-item:hover');
                const rect = hoveredItem.getBoundingClientRect();
                const containerRect = hoveredItem.parentElement.getBoundingClientRect();

                requestAnimationFrame(() => {
                    highlightPill.style.top = `${rect.top - containerRect.top}px`;
                    highlightPill.style.left = `${rect.left - containerRect.left}px`;
                    highlightPill.style.width = `${rect.width}px`;
                    highlightPill.style.height = `${rect.height}px`;
                });
            }
        });
    }
});
