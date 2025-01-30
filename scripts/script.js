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
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', darkModeToggle.checked ? 'enabled' : 'disabled');
        // Color update is now handled by Scene3D listener
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

    // Slideshow functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function previousSlide() {
        showSlide(currentSlide - 1);
    }

    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all PDF containers
    document.querySelectorAll('.pdf-container').forEach(container => {
        observer.observe(container);
    });

    // Add hover animation to footer
    const footer = document.querySelector('footer p');
    footer.addEventListener('mouseover', () => {
        footer.classList.add('pulse');
    });
    
    footer.addEventListener('mouseout', () => {
        footer.classList.remove('pulse');
    });

    // Enhanced scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animate all major sections
    document.querySelectorAll('section, .pdf-container, #canvas-container').forEach(elem => {
        elem.style.opacity = '0';
        elem.style.transform = 'translateY(30px)';
        elem.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        scrollObserver.observe(elem);
    });

    // Ensure heading animation triggers
    const heading = document.querySelector('section h2');
    if (heading) {
        heading.style.opacity = '0';
        setTimeout(() => {
            heading.style.opacity = '1';
        }, 100);
    }

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add zoom functionality
    const zoomContainer = document.getElementById('zoom-container');
    const zoomContent = zoomContainer.querySelector('.zoom-content');

    document.querySelectorAll('.pdf-container').forEach(container => {
        container.addEventListener('click', () => {
            const iframe = container.querySelector('iframe').cloneNode(true);
            zoomContent.innerHTML = '';
            zoomContent.appendChild(iframe);
            zoomContainer.classList.add('active');
        });
    });

    zoomContainer.addEventListener('click', (e) => {
        if (e.target === zoomContainer) {
            zoomContainer.classList.remove('active');
        }
    });

    // Add escape key listener for zoom view
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && zoomContainer.classList.contains('active')) {
            zoomContainer.classList.remove('active');
        }
    });

    // Create and load audio with error handling
    const pencilSound = new Audio();
    pencilSound.src = './sounds/pencil-draw.wav';  // Ensure correct path
    pencilSound.volume = 0.3;  // Increased volume
    pencilSound.load();  // Explicitly load the audio

    // Add error handling for audio
    pencilSound.addEventListener('error', (e) => {
        console.error('Error loading sound:', e);
    });

    // Test sound loading
    pencilSound.addEventListener('canplaythrough', () => {
        console.log('Sound loaded successfully');
    });

    let isDrawing = false;
    let lastX, lastY;
    let soundPlaying = false;

    function startDrawing(e) {
        isDrawing = true;
        lastX = e.clientX;
        lastY = e.clientY;
        
        // Create new audio instance for each draw
        const drawSound = new Audio(pencilSound.src);
        drawSound.volume = 0.3;
        drawSound.play().catch(e => console.error('Error playing sound:', e));
    }

    function stopDrawing() {
        isDrawing = false;
        soundPlaying = false;
    }

    function draw(e) {
        if (!isDrawing) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length < 5) return;

        const line = document.createElement('div');
        line.className = 'cursor-trail';
        line.style.left = `${lastX}px`;
        line.style.top = `${lastY}px`;
        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        document.body.appendChild(line);

        // Play sound with less delay
        if (!soundPlaying) {
            soundPlaying = true;
            const drawSound = new Audio(pencilSound.src);
            drawSound.volume = 0.3;
            drawSound.playbackRate = 0.8 + Math.random() * 0.4;
            drawSound.play()
                .then(() => {
                    setTimeout(() => {
                        soundPlaying = false;
                    }, 100);
                })
                .catch(e => console.error('Error playing sound:', e));
        }

        setTimeout(() => {
            line.style.opacity = '0';
            setTimeout(() => line.remove(), 300);
        }, 1000);

        lastX = e.clientX;
        lastY = e.clientY;
    }

    // Add event listeners for drawing
    document.addEventListener('mousedown', startDrawing);
    document.addEventListener('mouseup', stopDrawing);
    document.addEventListener('mouseleave', stopDrawing);
    document.addEventListener('mousemove', draw);

    // Remove old cursor trail code
    // document.removeEventListener('mousemove', createCursorTrail);

    // Add keyboard navigation
    const pdfContainers = document.querySelectorAll('.pdf-container');
    let currentFocus = 0;

    function showKeyHint() {
        const hint = document.createElement('div');
        hint.className = 'key-hint';
        hint.textContent = 'Use ← → keys to navigate, Space to zoom';
        document.body.appendChild(hint);
        setTimeout(() => hint.classList.add('visible'), 100);
        setTimeout(() => {
            hint.classList.remove('visible');
            setTimeout(() => hint.remove(), 300);
        }, 3000);
    }

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                currentFocus = Math.max(0, currentFocus - 1);
                pdfContainers[currentFocus].scrollIntoView({ behavior: 'smooth' });
                break;
            case 'ArrowRight':
                currentFocus = Math.min(pdfContainers.length - 1, currentFocus + 1);
                pdfContainers[currentFocus].scrollIntoView({ behavior: 'smooth' });
                break;
            case ' ':
                e.preventDefault();
                pdfContainers[currentFocus].click();
                break;
        }
    });

    // Show key hint on first interaction
    document.addEventListener('mousemove', showKeyHint, { once: true });
});