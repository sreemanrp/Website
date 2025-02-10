document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const featureItems = document.querySelectorAll('.feature-item');
    const highlightPill = document.querySelector('.highlight-pill');

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.documentElement.setAttribute(
            'data-theme',
            document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        );
        sunIcon.classList.toggle('hidden');
        moonIcon.classList.toggle('hidden');
    });

    // Hover effect functionality
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const rect = item.getBoundingClientRect();
            const containerRect = item.parentElement.getBoundingClientRect();
            
            highlightPill.style.top = `${rect.top - containerRect.top}px`;
            highlightPill.style.left = `${rect.left - containerRect.left}px`;
            highlightPill.style.width = `${rect.width}px`;
            highlightPill.style.height = `${rect.height}px`;
            highlightPill.style.opacity = '1';
        });

        item.addEventListener('mouseleave', () => {
            highlightPill.style.opacity = '0';
        });
    });
});
