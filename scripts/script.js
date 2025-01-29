document.addEventListener('DOMContentLoaded', () => {
    // Create slider toggle
    const toggleContainer = document.createElement('label');
    toggleContainer.className = 'switch';
    toggleContainer.innerHTML = `
      <input type="checkbox" id="darkModeToggle">
      <span class="slider"></span>
    `;
    document.body.prepend(toggleContainer);

    const darkModeToggle = document.getElementById('darkModeToggle');

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Update toggle interaction
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Handle PDF fallback
    document.querySelectorAll('.pdf-viewer').forEach(viewer => {
        if (!viewer.type) {
            const fallback = viewer.nextElementSibling;
            if (fallback && fallback.classList.contains('pdf-fallback')) {
                fallback.style.display = 'block';
            }
        }
    });

    // Add hover effect to gallery images (if any)
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
});