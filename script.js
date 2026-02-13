let currentSection = 0;
const sections = ['welcome', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'valentine-question', 'finale'];

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
    // Stop moving button if leaving valentine question
    if (noButtonInterval && sections[index] !== 'valentine-question') {
        clearInterval(noButtonInterval);
        noButtonInterval = null;
    }
    
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
            
            // Start moving No button if it's the valentine question section
            if (sections[index] === 'valentine-question') {
                // Reset counters
                noClickCount = 0;
                
                // Reset button states
                const btnNo = document.getElementById('btnNo');
                if (btnNo) {
                    btnNo.textContent = 'No';
                    btnNo.style.transform = 'scale(1)';
                }
                
                startMovingNoButton();
            }
            
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

// Valentine Question Functions
let noButtonInterval = null;
let noClickCount = 0;

const noButtonMessages = [
    'No',
    'Are you sure?',
    'Pookie please',
    'Really?',
    'I\'m gonna cry...',
    'Please?',
    'Don\'t do this',
    'Last chance!',
    'Pretty please?',
    'I\'m begging you'
];

function startMovingNoButton() {
    const btnNo = document.getElementById('btnNo');
    if (!btnNo) return;
    
    // Reset button position to normal (in container)
    btnNo.style.position = 'relative';
    btnNo.style.left = 'auto';
    btnNo.style.top = 'auto';
    btnNo.style.transform = 'scale(1)';
    btnNo.style.zIndex = '1';
    
    // Handle click on No button
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        handleNoClick();
    });
    
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleNoClick();
    });
}

function handleNoClick() {
    const btnNo = document.getElementById('btnNo');
    if (!btnNo) return;
    
    // Update No button text
    noClickCount++;
    if (noClickCount < noButtonMessages.length) {
        btnNo.textContent = noButtonMessages[noClickCount];
    } else {
        // Cycle back or keep last message
        btnNo.textContent = noButtonMessages[noButtonMessages.length - 1];
    }
    
    // Animate No button (shake effect)
    btnNo.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        btnNo.style.animation = '';
    }, 500);
}

function handleYes() {
    // Stop the moving interval
    if (noButtonInterval) {
        clearInterval(noButtonInterval);
        noButtonInterval = null;
    }
    
    // Create confetti effect
    createConfetti();
    
    // Show simple "Yayyyyyyyy!" message
    const valentineSection = document.getElementById('valentine-question');
    if (valentineSection) {
        const content = valentineSection.querySelector('.content');
        if (content) {
            content.innerHTML = `
                <h1 class="fade-in" style="font-size: clamp(3rem, 10vw, 6rem); animation: bounceIn 0.8s ease;">Yayyyyyyyy! 🎉</h1>
                <p class="subtitle fade-in-delay" style="font-size: clamp(1.5rem, 5vw, 2.5rem);">You made me the happiest! ❤️</p>
                <div class="heart-container fade-in-delay-2">
                    <span class="heart">❤️</span>
                    <span class="heart-small heart-1">💕</span>
                    <span class="heart-small heart-2">💖</span>
                    <span class="heart-small heart-3">💗</span>
                    <span class="heart-small heart-4">💝</span>
                </div>
                <button class="btn-continue fade-in-delay-3" onclick="showFinale()">Continue ❤️</button>
            `;
        }
    }
}

function showFinale() {
    showSection(sections.indexOf('finale'));
}

function createConfetti() {
    const colors = ['#ff6b9d', '#ffc0cb', '#ff69b4', '#ff1493', '#ffb6c1', '#ff69b4'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.opacity = Math.random() * 0.8 + 0.2;
        
        document.body.appendChild(confetti);
        
        // Animate confetti falling
        const animationDuration = Math.random() * 2 + 2;
        const horizontalMovement = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(${horizontalMovement}px, ${window.innerHeight + 100}px) rotate(720deg)`,
                opacity: 0
            }
        ], {
            duration: animationDuration * 1000,
            easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
        });
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
    
    // Add heart emojis falling
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '💓', '💞'];
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.position = 'fixed';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '-50px';
        heart.style.zIndex = '9999';
        heart.style.pointerEvents = 'none';
        heart.style.opacity = 0.8;
        
        document.body.appendChild(heart);
        
        const animationDuration = Math.random() * 2 + 2;
        const horizontalMovement = (Math.random() - 0.5) * 300;
        
        heart.animate([
            {
                transform: `translate(0, 0) rotate(0deg) scale(1)`,
                opacity: 0.8
            },
            {
                transform: `translate(${horizontalMovement}px, ${window.innerHeight + 100}px) rotate(360deg) scale(1.5)`,
                opacity: 0
            }
        ], {
            duration: animationDuration * 1000,
            easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
        });
        
        setTimeout(() => {
            heart.remove();
        }, animationDuration * 1000);
    }
}
