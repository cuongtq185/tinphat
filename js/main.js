// ========== MAIN.JS - VANILLA JAVASCRIPT ========== //

// ========== 1. DOCUMENT READY ========== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    // Initialize functions
    initStatistics();
    initFormSubmit();
    initNavbarActive();
    initScrollAnimations();
    initNavbarClose();
});

// ========== 2. STATISTICS COUNTER ANIMATION ========== //
function initStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasRun = false;

    // Observer to detect when stats section is visible
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !hasRun) {
                hasRun = true;
                statNumbers.forEach(function(element) {
                    animateCounter(element);
                });
            }
        });
    }, observerOptions);

    // Observe first stat element
    if (statNumbers.length > 0) {
        observer.observe(statNumbers[0].parentElement);
    }
}

/**
 * Animate counter from 0 to target number
 * @param {HTMLElement} element - The element containing the target number
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    let current = 0;
    const increment = target / 50; // 50 steps
    const duration = 2000; // 2 seconds
    const stepDuration = duration / 50;

    const counter = setInterval(function() {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepDuration);
}

// ========== 3. FORM SUBMISSION ========== //
function initFormSubmit() {
    const submitBtn = document.getElementById('submitBtn');
    const contactForm = document.getElementById('contactForm');

    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            handleFormSubmit();
        });
    }

    // Also allow Enter key submit
    if (contactForm) {
        contactForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                handleFormSubmit();
            }
        });
    }
}

/**
 * Handle form submission
 */
function handleFormSubmit() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation
    if (!name || !email || !phone || !message) {
        showAlert('Vui lòng điền đầy đủ thông tin!', 'warning');
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        showAlert('Email không hợp lệ!', 'warning');
        return;
    }

    // Phone validation (basic)
    if (phone.length < 10) {
        showAlert('Số điện thoại phải có ít nhất 10 chữ số!', 'warning');
        return;
    }

    // Simulate form submission
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang gửi...';

    // Simulate API call
    setTimeout(function() {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Show success message
        showAlert('Thông tin đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'success');

        // Log form data (in real app, would send to server)
        console.log('Form Data:', {
            name: name,
            email: email,
            phone: phone,
            message: message,
            timestamp: new Date().toLocaleString('vi-VN')
        });

        // Reset form
        document.getElementById('contactForm').reset();

        // Close modal after 2 seconds
        setTimeout(function() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            if (modal) {
                modal.hide();
            }
        }, 2000);
    }, 1500);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show Bootstrap alert
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, warning, danger, info)
 */
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Insert before contact form modal or body
    const modal = document.querySelector('.modal-body');
    if (modal) {
        modal.insertBefore(alertDiv, modal.firstChild);
    } else {
        document.body.insertBefore(alertDiv, document.body.firstChild);
    }

    // Auto remove after 5 seconds
    setTimeout(function() {
        alertDiv.remove();
    }, 5000);
}

// ========== 4. UPDATE NAVBAR ACTIVE LINK ========== //
function initNavbarActive() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(function(l) {
                l.classList.remove('active');
            });
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', updateNavbarOnScroll);
}

/**
 * Update navbar active link based on scroll position
 */
function updateNavbarOnScroll() {
    const sections = document.querySelectorAll('section[id], nav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    let current = '';
    sections.forEach(function(section) {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ========== 5. CLOSE NAVBAR ON LINK CLICK (MOBILE) ========== //
function initNavbarClose() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                const navbar = document.querySelector('.navbar-toggler');
                navbar.click();
            }
        });
    });
}

// ========== 6. SCROLL ANIMATIONS ========== //
function initScrollAnimations() {
    const elements = document.querySelectorAll('.service-card, .blog-card, .review-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(function(element) {
        observer.observe(element);
    });
}

// ========== 7. SMOOTH SCROLL FOR ANCHOR LINKS ========== //
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for dropdown toggle
        if (this.hasAttribute('data-bs-toggle')) {
            return;
        }

        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== 8. BACK TO TOP BUTTON ========== //
function initBackToTop() {
    // Create back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTopBtn';
    backToTopBtn.className = 'btn btn-primary rounded-circle';
    backToTopBtn.title = 'Lên đầu trang';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        display: none;
        z-index: 99;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(backToTopBtn);

    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            backToTopBtn.style.alignItems = 'center';
            backToTopBtn.style.justifyContent = 'center';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });

    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}

// Initialize back to top button
initBackToTop();

// ========== 9. LAZY LOADING IMAGES ========== //
function initLazyLoadImages() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Reload image
                observer.unobserve(img);
            }
        });
    });

    images.forEach(function(img) {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
initLazyLoadImages();

// ========== 10. UTILITY FUNCTIONS ========== //

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
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

/**
 * Format date to Vietnamese format
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatDateVN(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', locale: 'vi-VN' };
    return new Date(date).toLocaleDateString('vi-VN', options);
}

/**
 * Log Analytics (Optional - for future use)
 */
function logPageView() {
    console.log('Page View:', {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
    });
}

// Log page view on load
logPageView();

// ========== 11. KEYBOARD SHORTCUTS ========== //
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K: Focus search (if added in future)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        console.log('Search shortcut triggered');
    }

    // Esc: Close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(function(modal) {
            bootstrap.Modal.getInstance(modal)?.hide();
        });
    }
});

// ========== 12. PERFORMANCE LOGGING ========== //
if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log('Page Load Time: ' + loadTime + 'ms');
        }, 0);
    });
}

// ========== 13. CONSOLE WELCOME MESSAGE ========== //
console.log('%c🎉 Welcome to TIN PHAT Website!', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cDesigned with ❤️ using HTML5, CSS3, Bootstrap 5 & Vanilla JavaScript', 'font-size: 14px; color: #764ba2;');
console.log('%cFor inquiries, contact us at info@vietsurvey.com', 'font-size: 12px; color: #20c997;');
