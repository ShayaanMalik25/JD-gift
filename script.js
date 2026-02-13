let currentSection = 0;
const sections = ['welcome', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'finale'];

function initStory() {
    // Show welcome screen first
    showSection(0);
    
    // Create floating hearts dynamically
    createFloatingHearts();
    
    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        // Swipe left to go forward
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSection < sections.length - 1) {
                nextSection();
            } else if (diff < 0 && currentSection > 0) {
                prevSection();
            }
        }
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            if (currentSection < sections.length - 1) {
                nextSection();
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentSection > 0) {
                prevSection();
            }
        }
    });
}

function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    const heartEmojis = ['💕', '💖', '💗', '💝', '❤️', '💓', '💞'];
    
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (15 + Math.random() * 15) + 'px';
        heart.style.opacity = 0.2 + Math.random() * 0.3;
        heart.style.animation = `float ${15 + Math.random() * 10}s infinite linear`;
        heart.style.animationDelay = Math.random() * 5 + 's';
        heartsContainer.appendChild(heart);
    }
}

function showSection(index) {
    // Hide all sections with animation
    sections.forEach((sectionId, i) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('active');
            
            // Reset animations
            const images = section.querySelectorAll('.story-image');
            const texts = section.querySelectorAll('.text-content p, .text-content h2');
            
            images.forEach(img => {
                img.style.animation = 'none';
                setTimeout(() => {
                    img.style.animation = '';
                }, 10);
            });
            
            texts.forEach(text => {
                text.style.animation = 'none';
                setTimeout(() => {
                    text.style.animation = '';
                }, 10);
            });
        }
    });
    
    // Show current section
    const currentSectionElement = document.getElementById(sections[index]);
    if (currentSectionElement) {
        // Add entrance animation
        setTimeout(() => {
            currentSectionElement.classList.add('active');
            
            // Trigger image animation
            const imageWrapper = currentSectionElement.querySelector('.image-wrapper');
            if (imageWrapper) {
                imageWrapper.style.animation = 'none';
                setTimeout(() => {
                    imageWrapper.style.animation = 'imageSlideIn 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 50);
            }
            
            // Trigger text animations
            const title = currentSectionElement.querySelector('.title-animate');
            const text = currentSectionElement.querySelector('.text-animate');
            
            if (title) {
                title.style.animation = 'none';
                setTimeout(() => {
                    title.style.animation = 'slideInFromLeft 1s ease-out';
                }, 50);
            }
            
            if (text) {
                text.style.animation = 'none';
                setTimeout(() => {
                    text.style.animation = 'fadeInUp 1s ease-out 0.3s both';
                }, 50);
            }
            
            // Add sparkle effect
            createSparkles(currentSectionElement);
        }, 100);
        
        currentSection = index;
        
        // Scroll to top on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function createSparkles(element) {
    const sparkleEmojis = ['✨', '⭐', '💫'];
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('span');
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        sparkle.style.position = 'absolute';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.fontSize = '1.5rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.animation = 'sparkle 2s ease-out forwards';
        sparkle.style.zIndex = '1000';
        element.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
}

function nextSection() {
    if (currentSection < sections.length - 1) {
        // Add transition effect
        const currentEl = document.getElementById(sections[currentSection]);
        if (currentEl) {
            currentEl.style.transform = 'translateX(-100%) scale(0.9)';
        }
        
        setTimeout(() => {
            showSection(currentSection + 1);
        }, 300);
    }
}

function prevSection() {
    if (currentSection > 0) {
        // Add transition effect
        const currentEl = document.getElementById(sections[currentSection]);
        if (currentEl) {
            currentEl.style.transform = 'translateX(100%) scale(0.9)';
        }
        
        setTimeout(() => {
            showSection(currentSection - 1);
        }, 300);
    }
}

function restartStory() {
    const currentEl = document.getElementById(sections[currentSection]);
    if (currentEl) {
        currentEl.style.transform = 'translateX(100%) scale(0.9)';
    }
    
    setTimeout(() => {
        showSection(0);
    }, 300);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initStory);

// Prevent zoom on double tap (mobile)
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add parallax effect on scroll (for desktop)
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const currentSectionEl = document.getElementById(sections[currentSection]);
    if (currentSectionEl && window.innerWidth > 768) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        const imageWrapper = currentSectionEl.querySelector('.image-wrapper');
        if (imageWrapper) {
            imageWrapper.style.transform = `translateY(${parallax * 0.3}px)`;
        }
    }
    lastScrollY = window.pageYOffset;
}, { passive: true });
