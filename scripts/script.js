// Initialize dark mode toggle
const darkModeToggle = document.createElement('button');
darkModeToggle.textContent = '🌓 Toggle Theme';
darkModeToggle.ariaLabel = 'Toggle dark mode';
document.body.prepend(darkModeToggle);

// Add smooth transitions and Web3-style interactions
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.style.transform = `scale(0.95)`;
    setTimeout(() => {
        darkModeToggle.style.transform = '';
    }, 100);
});

// Add hover effect to gallery images
document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('mousemove', (e) => {
        const rect = img.getBoundingClientRect();
        const x = (e.clientX - rect.left) / img.width;
        const y = (e.clientY - rect.top) / img.height;
        
        img.style.transform = `perspective(1000px)
            rotateX(${(0.5 - y) * 10}deg)
            rotateY(${(x - 0.5) * 10}deg)
            translateZ(30px)`;
    });

    img.addEventListener('mouseleave', () => {
        img.style.transform = '';
    });
});