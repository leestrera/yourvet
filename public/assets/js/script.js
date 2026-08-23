// Enhanced Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    
    // Fixed bottom paw with shock waves - hide on scroll (mobile only)
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator && window.innerWidth <= 768) {
        // Handle scroll to hide/show paw
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) { // Hide when scrolled down 100px
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(100px)';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
            }
        });
        
        // Handle click to scroll to next section
        scrollIndicator.addEventListener('click', function() {
            const hero = document.querySelector('.hero');
            const nextSection = hero ? hero.nextElementSibling : null;
            
            if (nextSection) {
                const offsetTop = nextSection.offsetTop - 100; // 50px offset from top
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isActive = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (isActive) {
                body.style.overflow = 'hidden';
                // Add touch event for mobile swipe to close
                let startY = 0;
                navMenu.addEventListener('touchstart', (e) => {
                    startY = e.touches[0].clientY;
                });
                
                navMenu.addEventListener('touchmove', (e) => {
                    const currentY = e.touches[0].clientY;
                    if (startY - currentY > 50) { // Swipe up to close
                        closeMenu();
                    }
                });
            } else {
                body.style.overflow = '';
            }
        });
        
        function closeMenu() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflow = '';
        }
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Handle window resize - close menu if screen gets larger
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
});

// Form Validation
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    let errors = [];
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.getAttribute('id');
        
        // Remove existing error styling
        field.classList.remove('error');
        
        if (!value) {
            isValid = false;
            field.classList.add('error');
            errors.push(`${fieldName.replace('_', ' ')} is required`);
            return;
        }
        
        // Email validation
        if (field.type === 'email' && !isValidEmail(value)) {
            isValid = false;
            field.classList.add('error');
            errors.push('Please enter a valid email address');
        }
        
        // Phone validation
        if (field.type === 'tel' && !isValidPhone(value)) {
            isValid = false;
            field.classList.add('error');
            errors.push('Please enter a valid phone number');
        }
    });
    
    return { isValid, errors };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

// Auto-hide alerts
function autoHideAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    });
}

// Initialize auto-hide alerts
document.addEventListener('DOMContentLoaded', autoHideAlerts);

// Testimonials Carousel - One at a time
let currentSlideIndex = 0;

function getCardDimensions() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 480) {
        // Mobile: show 1 card per view for better readability
        return {
            cardWidth: screenWidth - 110,
            gap: 16 // 1rem = 16px
        };
    } else if (screenWidth <= 768) {
        // Tablet: smaller cards to fit more
        return {
            cardWidth: 250,
            gap: 20 // 1.25rem = 20px
        };
    } else {
        // Desktop
        return {
            cardWidth: 300,
            gap: 24 // 1.5rem = 24px
        };
    }
}

function moveCarousel(direction) {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const totalSlides = cards.length;
    
    if (!track || totalSlides === 0) return;
    
    // Calculate next slide index
    let nextSlideIndex = currentSlideIndex + direction;
    
    // Calculate how many testimonials fit in one view to determine boundaries
    const wrapper = document.querySelector('.testimonials-wrapper');
    if (!wrapper) return;
    
    const wrapperWidth = wrapper.offsetWidth;
    const { cardWidth, gap } = getCardDimensions();
    const testimonialsPerView = Math.max(1, Math.floor(wrapperWidth / (cardWidth + gap)));
    const lastMeaningfulIndex = Math.max(0, totalSlides - testimonialsPerView);
    
    // Prevent going past the last meaningful position or before the first
    if (nextSlideIndex > lastMeaningfulIndex) {
        return; // Don't move if already at last meaningful position
    } else if (nextSlideIndex < 0) {
        return; // Don't move if already at first
    }
    
    currentSlideIndex = nextSlideIndex;
    
    const moveDistance = cardWidth + gap;
    const translateX = currentSlideIndex * -moveDistance;
    
    track.style.transform = `translateX(${translateX}px)`;
    
    // Update arrow visibility
    updateArrowVisibility();
}

// Update arrow visibility based on current position
function updateArrowVisibility() {
    const totalSlides = document.querySelectorAll('.testimonial-card').length;
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const wrapper = document.querySelector('.testimonials-wrapper');
    
    if (!prevBtn || !nextBtn || !wrapper) return;
    
    // Calculate how many testimonials fit in one view
    const wrapperWidth = wrapper.offsetWidth;
    const { cardWidth, gap } = getCardDimensions();
    const testimonialsPerView = Math.max(1, Math.floor(wrapperWidth / (cardWidth + gap)));
    
    // The last meaningful position is where we can see the last testimonial
    // If we have 11 testimonials and can see 3 at once, last position is index 8 (shows testimonials 9, 10, 11)
    const lastMeaningfulIndex = Math.max(0, totalSlides - testimonialsPerView);
    
    // Hide left arrow if at first slide
    if (currentSlideIndex <= 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
    }
    
    // Hide right arrow if we've reached the last meaningful position
    if (currentSlideIndex >= lastMeaningfulIndex) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'flex';
    }
    
}

// Auto-slide functionality
function startAutoSlide() {
    setInterval(() => {
        moveCarousel(1);
    }, 6000); // Change slide every 6 seconds
}

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', function() {
    // Auto-slide is disabled - carousel only moves with manual controls
    
    // Initialize first testimonial position and set proper track width
    const track = document.querySelector('.testimonials-track');
    if (track) {
        track.style.transform = 'translateX(0px)';
        currentSlideIndex = 0;
        
        // Set proper track width based on number of testimonials
        const cards = document.querySelectorAll('.testimonial-card');
        const { cardWidth, gap } = getCardDimensions();
        const totalWidth = (cardWidth * cards.length) + (gap * (cards.length - 1));
        track.style.width = `${totalWidth}px`;
        
        // Set initial arrow visibility
        updateArrowVisibility();
        
        // Initialize testimonial read more functionality
        initTestimonialReadMore();
    }
    
    // Handle window resize - recalculate positioning
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const track = document.querySelector('.testimonials-track');
            if (track) {
                // Recalculate track width and position based on current slide and new dimensions
                const cards = document.querySelectorAll('.testimonial-card');
                const { cardWidth, gap } = getCardDimensions();
                const totalWidth = (cardWidth * cards.length) + (gap * (cards.length - 1));
                track.style.width = `${totalWidth}px`;
                
                const moveDistance = cardWidth + gap;
                const translateX = currentSlideIndex * -moveDistance;
                track.style.transform = `translateX(${translateX}px)`;
            }
        }, 250); // Debounce resize events
    });
});

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', initSmoothScrolling);

// Form submission with AJAX
function setupAjaxForms() {
    const forms = document.querySelectorAll('.ajax-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const validation = validateForm(this);
            if (!validation.isValid) {
                showErrorMessage(validation.errors.join('<br>'));
                return;
            }
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessMessage(data.message);
                    this.reset();
                } else {
                    showErrorMessage(data.message || 'An error occurred');
                }
            })
            .catch(error => {
                showErrorMessage('An error occurred. Please try again.');
                console.error('Error:', error);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
        });
    });
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.flash-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type} flash-message`;
    messageDiv.innerHTML = `
        <div class="container">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        </div>
    `;
    
    // Insert after header
    const header = document.querySelector('.header');
    header.insertAdjacentElement('afterend', messageDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 5000);
}

// Initialize AJAX forms
document.addEventListener('DOMContentLoaded', setupAjaxForms);

// Appointment date/time validation
function setupAppointmentValidation() {
    const dateInput = document.querySelector('input[name="preferred_date"]');
    const timeInput = document.querySelector('input[name="preferred_time"]');
    
    if (dateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        // Set maximum date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
    }
    
    if (timeInput) {
        // Validate business hours
        timeInput.addEventListener('change', function() {
            const time = this.value;
            const [hours, minutes] = time.split(':').map(Number);
            const timeInMinutes = hours * 60 + minutes;
            
            // Business hours: 8:00 AM to 6:00 PM (480 to 1080 minutes)
            if (timeInMinutes < 480 || timeInMinutes > 1080) {
                this.setCustomValidity('Please select a time during business hours (8:00 AM - 6:00 PM)');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

// Initialize appointment validation
document.addEventListener('DOMContentLoaded', setupAppointmentValidation);

// Image lazy loading fallback for older browsers
function setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize image lazy loading
document.addEventListener('DOMContentLoaded', setupImageLazyLoading);

// Add CSS for error styling
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: var(--error) !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .flash-message {
        position: relative;
        z-index: 1000;
        transition: all 0.3s ease;
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    /* Enhanced Mobile Optimizations */
    @media (max-width: 768px) {
        .nav-menu.active {
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
        }
        
        body.menu-open {
            overflow: hidden;
            position: fixed;
            width: 100%;
        }
        
        /* Improve touch targets */
        .btn {
            min-height: 44px;
            padding: 12px 24px;
        }
        
        /* Better form inputs on mobile */
        input, select, textarea {
            font-size: 16px; /* Prevents zoom on iOS */
        }
        
        /* Smooth scrolling */
        html {
            scroll-behavior: smooth;
        }
        
        /* Fix viewport issues */
        body {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
    }
`;

document.head.appendChild(style);

// Add mobile-specific optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Improve mobile scroll performance
    if ('ontouchstart' in window) {
        document.body.style.webkitOverflowScrolling = 'touch';
    }
    
    // Add viewport meta tag optimization for mobile
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    }
    
    // Prevent double-tap zoom on buttons
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.style.touchAction = 'manipulation';
    });
    
    // Add focus improvements for touch devices
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', function() {}, {passive: true});
    }

    // Paw Print Scroll Reveal Effect
    function initPawReveal() {
        // Get all individual paw prints that should be revealed on scroll
        const pawPrints = document.querySelectorAll('.paw-trail-overlay .paw-print, .paw-trail-wellness .paw-print, .paw-trail-diagnostic .paw-print, .paw-trail-dental .paw-print, .paw-trail-surgery .paw-print, .paw-trail-emergency .paw-print');
        
        if (pawPrints.length === 0) return;

        // Create intersection observer for individual paw prints
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px', // Trigger when paw is 10% above bottom of viewport
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.classList.contains('paw-revealed')) {
                    // Reveal this specific paw when it enters viewport
                    entry.target.classList.add('paw-revealed');
                }
            });
        }, observerOptions);

        // Observe each individual paw print
        pawPrints.forEach(paw => {
            observer.observe(paw);
        });
    }

    // Initialize paw reveal after DOM is loaded
    initPawReveal();
});

// Testimonial Read More Functionality
function initTestimonialReadMore() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach((card, index) => {
        const blockquote = card.querySelector('blockquote');
        const fullText = blockquote.textContent.trim();
        
        // Check if text is truncated by comparing scroll height with client height
        if (blockquote.scrollHeight > blockquote.clientHeight) {
            // Add read more link
            const readMoreLink = document.createElement('div');
            readMoreLink.className = 'read-more-link';
            readMoreLink.textContent = 'Read more';
            readMoreLink.onclick = () => showTestimonialModal(card, fullText, index);
            
            card.appendChild(readMoreLink);
        }
    });
    
    // Create modal if it doesn't exist
    createTestimonialModal();
}

function createTestimonialModal() {
    if (document.getElementById('testimonialModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'testimonialModal';
    modal.className = 'testimonial-modal';
    modal.innerHTML = `
        <div class="testimonial-modal-content">
            <span class="testimonial-modal-close">&times;</span>
            <div class="testimonial-modal-rating"></div>
            <blockquote class="testimonial-modal-text"></blockquote>
            <div class="testimonial-modal-author"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add close event listeners
    const closeBtn = modal.querySelector('.testimonial-modal-close');
    closeBtn.onclick = closeTestimonialModal;
    
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeTestimonialModal();
        }
    };
    
    // Close on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeTestimonialModal();
        }
    });
}

function showTestimonialModal(card, fullText, index) {
    const modal = document.getElementById('testimonialModal');
    const rating = card.querySelector('.testimonial-rating').innerHTML;
    const author = card.querySelector('.testimonial-author').innerHTML;
    
    modal.querySelector('.testimonial-modal-rating').innerHTML = rating;
    modal.querySelector('.testimonial-modal-text').textContent = fullText;
    modal.querySelector('.testimonial-modal-author').innerHTML = author;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeTestimonialModal() {
    const modal = document.getElementById('testimonialModal');
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scroll
}