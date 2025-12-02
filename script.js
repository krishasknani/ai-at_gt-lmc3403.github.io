// ==========================================
// Georgia Tech AI Study Website - Main JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initStatCounter();
    initAnimations();
});

// ==========================================
// Navigation
// ==========================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================
// Scroll Effects
// ==========================================
function initScrollEffects() {
    // Parallax effect for landing shapes
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ==========================================
// Animated Counter
// ==========================================
function initStatCounter() {
    const statNumber = document.querySelector('.stat-number');
    if (!statNumber) return;
    
    const target = parseInt(statNumber.dataset.target);
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    
    let current = start;
    let hasAnimated = false;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            statNumber.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            statNumber.textContent = target;
        }
    };
    
    // Start counter when element is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                updateCounter();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statNumber);
}

// ==========================================
// Scroll Animations
// ==========================================
function initAnimations() {
    // Elements to animate
    const animatedElements = [
        { selector: '.section-label', class: 'fade-in' },
        { selector: '.section-title', class: 'fade-in' },
        { selector: '.featured-quote', class: 'fade-in' },
        { selector: '.problem-card', class: 'fade-in' },
        { selector: '.problem-statement', class: 'fade-in' },
        { selector: '.survey-explanation', class: 'fade-in' },
        { selector: '.guidelines-column', class: 'fade-in' },
        { selector: '.guideline-item', class: 'slide-in-left' },
        { selector: '.process-list li', class: 'slide-in-right' },
        { selector: '.poster-image-container', class: 'slide-in-left' },
        { selector: '.poster-text', class: 'slide-in-right' },
        { selector: '.contact-item', class: 'fade-in' },
        { selector: '.contact-cta', class: 'fade-in' }
    ];
    
    // Add animation classes to elements
    animatedElements.forEach(({ selector, class: animClass }) => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add(animClass);
        });
    });
    
    // Intersection Observer for triggering animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                const siblings = entry.target.parentElement?.querySelectorAll(`.${entry.target.classList[0]}`);
                if (siblings && siblings.length > 1) {
                    const index = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                entry.target.classList.add('visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        animationObserver.observe(el);
    });
}

// ==========================================
// Utility Functions
// ==========================================

// Debounce function for performance
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 16) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// Easter Egg: Konami Code
// ==========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    document.body.style.transition = 'filter 0.5s ease';
    document.body.style.filter = 'hue-rotate(180deg)';
    
    setTimeout(() => {
        document.body.style.filter = 'none';
    }, 3000);
    
    console.log('🐝 Go Jackets! 🐝');
}

