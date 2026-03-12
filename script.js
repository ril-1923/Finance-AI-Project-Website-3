// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = 'blue';
        this.currentFont = 'Inter';
        this.init();
    }

    init() {
        this.setupThemeButtons();
        this.setupFontSelector();
        this.setupCounters();
        this.setupSmoothScrolling();
        this.setupFormSubmission();
        this.loadUserPreferences();
    }

    setupThemeButtons() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        
        themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.dataset.theme;
                this.changeTheme(theme);
                this.updateActiveThemeButton(button);
                this.saveUserPreferences();
            });
        });
    }

    changeTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Add smooth transition
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    updateActiveThemeButton(activeButton) {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    setupFontSelector() {
        const fontSelector = document.getElementById('fontSelector');
        
        fontSelector.addEventListener('change', (e) => {
            this.changeFont(e.target.value);
            this.saveUserPreferences();
        });
    }

    changeFont(font) {
        this.currentFont = font;
        document.body.className = document.body.className.replace(/font-\w+/g, '');
        
        if (font !== 'Inter') {
            document.body.classList.add(`font-${font.toLowerCase().replace(' ', '')}`);
        }
    }

    saveUserPreferences() {
        localStorage.setItem('financeHubTheme', this.currentTheme);
        localStorage.setItem('financeHubFont', this.currentFont);
    }

    loadUserPreferences() {
        const savedTheme = localStorage.getItem('financeHubTheme');
        const savedFont = localStorage.getItem('financeHubFont');

        if (savedTheme) {
            this.changeTheme(savedTheme);
            const themeButton = document.querySelector(`[data-theme="${savedTheme}"]`);
            if (themeButton) {
                this.updateActiveThemeButton(themeButton);
            }
        }

        if (savedFont) {
            this.changeFont(savedFont);
            document.getElementById('fontSelector').value = savedFont;
        }
    }

    setupCounters() {
        const counters = document.querySelectorAll('.counter');
        const options = {
            threshold: 0.7
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseFloat(element.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target < 10) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupFormSubmission() {
        const contactForm = document.querySelector('.contact-form');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });
    }

    handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage();
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }

    showSuccessMessage() {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show mt-3';
        alert.innerHTML = `
            <strong>Success!</strong> Your message has been sent. We'll get back to you soon.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const form = document.querySelector('.contact-form');
        form.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Scroll Effects
class ScrollEffects {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        this.setupNavbarScrollEffect();
        this.setupScrollAnimations();
    }

    setupNavbarScrollEffect() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(0, 102, 204, 0.95)';
                this.navbar.style.backdropFilter = 'blur(10px)';
            } else {
                this.navbar.style.background = 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))';
                this.navbar.style.backdropFilter = 'none';
            }
        });
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .feature-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            observer.observe(element);
        });
    }
}

// Mobile Menu Handler
class MobileHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupTouchGestures();
    }

    setupMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }

    setupTouchGestures() {
        // Add touch-friendly hover effects for mobile
        if ('ontouchstart' in window) {
            const cards = document.querySelectorAll('.service-card, .testimonial-card');
            
            cards.forEach(card => {
                card.addEventListener('touchstart', () => {
                    card.style.transform = 'translateY(-5px)';
                });
                
                card.addEventListener('touchend', () => {
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 150);
                });
            });
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.transition = 'opacity 1s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    

    preloadCriticalResources() {
        // Preload critical fonts
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
        ];

        fonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = fontUrl;
            document.head.appendChild(link);
        });
    }
}

// Accessibility Features
class AccessibilityHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
    }

    setupKeyboardNavigation() {
        // Add keyboard support for theme buttons
        document.querySelectorAll('.theme-btn').forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    setupFocusManagement() {
        // Ensure proper focus management for modals
        const offcanvas = document.getElementById('settingsPanel');
        
        offcanvas.addEventListener('shown.bs.offcanvas', () => {
            const firstButton = offcanvas.querySelector('.theme-btn');
            if (firstButton) {
                firstButton.focus();
            }
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA labels for better screen reader support
        document.querySelectorAll('.counter').forEach(counter => {
            counter.setAttribute('aria-live', 'polite');
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new ScrollEffects();
    new MobileHandler();
    new PerformanceMonitor();
    new AccessibilityHandler();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Could send error reports to monitoring service
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}