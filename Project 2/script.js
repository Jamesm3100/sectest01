document.getElementById('client-type').addEventListener('change', function() {
    const otherTypeGroup = document.getElementById('other-type-group');
    if (this.value === 'other') {
        otherTypeGroup.style.display = 'block';
        // Add a small delay to ensure the display: block has taken effect
        setTimeout(() => {
            otherTypeGroup.classList.add('fade-in');
        }, 10);
        document.getElementById('other-type').required = true;
    } else {
        otherTypeGroup.classList.remove('fade-in');
        otherTypeGroup.style.display = 'none';
        document.getElementById('other-type').required = false;
    }
});

// Back to Top Button Functionality
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form fields
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Reset previous errors
        clearErrors();
        
        // Validate fields
        let isValid = true;
        
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        }
        
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Message is required');
            isValid = false;
        }
        
        if (isValid) {
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            
            try {
                // Submit form
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    showSuccess('Thank you for your message. We\'ll be in touch soon!');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                showError(submitButton, 'Failed to send message. Please try again.');
            } finally {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        }
    });
}

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.parentNode.appendChild(errorDiv);
    element.classList.add('error');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(element => element.classList.remove('error'));
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    contactForm.insertAdjacentElement('beforebegin', successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Mobile Menu Toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuButton.setAttribute('aria-expanded', 
            mobileMenuButton.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
        );
    });
}

// Dropdown Menu Accessibility
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    const content = dropdown.querySelector('.dropdown-content');
    
    // Add ARIA attributes
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('aria-haspopup', 'true');
    content.setAttribute('role', 'menu');
    
    // Handle keyboard navigation
    link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
            link.setAttribute('aria-expanded', content.style.display === 'block');
        }
    });
});

// Lazy Loading Images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// Cookie Consent
function initCookieConsent() {
    if (!localStorage.getItem('cookieConsent')) {
        const cookieBar = document.createElement('div');
        cookieBar.className = 'cookie-consent';
        cookieBar.innerHTML = `
            <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
            <button class="cookie-accept">Accept</button>
            <button class="cookie-decline">Decline</button>
        `;
        
        document.body.appendChild(cookieBar);
        
        cookieBar.querySelector('.cookie-accept').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBar.remove();
        });
        
        cookieBar.querySelector('.cookie-decline').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBar.remove();
        });
    }
}

// Initialize Cookie Consent
initCookieConsent();

// Google Analytics
function initGoogleAnalytics() {
    if (localStorage.getItem('cookieConsent') === 'accepted') {
        // Add your Google Analytics code here
        // window.dataLayer = window.dataLayer || [];
        // function gtag(){dataLayer.push(arguments);}
        // gtag('js', new Date());
        // gtag('config', 'YOUR-GA-ID');
    }
}

// Initialize Google Analytics
initGoogleAnalytics();

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle-input');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply the theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.checked = false;
    }
    
    // Toggle theme on checkbox change
    themeToggle.addEventListener('change', () => {
        const isDarkMode = themeToggle.checked;
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const isDarkMode = e.matches;
            document.body.classList.toggle('dark-mode', isDarkMode);
            themeToggle.checked = isDarkMode;
        }
    });
});

// Search Functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const searchResults = document.querySelector('.search-results');
    
    // Sample search data (replace with your actual content)
    const searchData = [
        { title: 'Residential Security', url: 'services.html#residential', description: 'Home security solutions and services' },
        { title: 'Commercial Security', url: 'services.html#commercial', description: 'Business security systems and solutions' },
        { title: 'Industrial Security', url: 'services.html#industrial', description: 'Industrial facility security services' },
        { title: 'Security Consultation', url: 'services.html#consultation', description: 'Professional security consulting' },
        { title: 'About Us', url: 'about.html', description: 'Learn about The Murdoch Group' },
        { title: 'Contact', url: 'contact.html', description: 'Get in touch with our team' },
        { title: 'Home Security Tips', url: 'blog/home-security-tips.html', description: 'Essential tips for home security' },
        { title: 'Business Security 2024', url: 'blog/business-security-2024.html', description: 'Latest trends in business security' }
    ];
    
    // Function to perform search
    function performSearch(query) {
        if (query.length < 2) {
            searchResults.classList.remove('visible');
            return;
        }
        
        const matches = searchData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        );
        
        if (matches.length > 0) {
            searchResults.innerHTML = matches.map(item => `
                <div class="search-result-item">
                    <a href="${item.url}">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </a>
                </div>
            `).join('');
            searchResults.classList.add('visible');
        } else {
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
            searchResults.classList.add('visible');
        }
    }
    
    // Search on input
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value.toLowerCase());
    });
    
    // Search on button click
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value.toLowerCase());
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value.toLowerCase());
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('visible');
        }
    });
    
    // Focus search input when clicking the search button
    searchButton.addEventListener('click', () => {
        searchInput.focus();
    });
});

// FAQ Functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// Newsletter Form
const newsletterForm = document.getElementById('newsletter-form');

newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    try {
        // Show loading state
        const submitButton = newsletterForm.querySelector('button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;

        // Simulate API call (replace with actual API endpoint)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success message
        showSuccess('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
    } catch (error) {
        showError('Failed to subscribe. Please try again.');
    } finally {
        // Reset button state
        const submitButton = newsletterForm.querySelector('button');
        submitButton.textContent = 'Subscribe';
        submitButton.disabled = false;
    }
});

// Live Chat Functionality
const chatButton = document.querySelector('.chat-button');
const chatWindow = document.querySelector('.chat-window');
const chatClose = document.querySelector('.chat-close');
const chatInput = document.querySelector('.chat-input input');
const chatMessages = document.querySelector('.chat-messages');

chatButton.addEventListener('click', () => {
    chatWindow.classList.add('visible');
    chatButton.style.display = 'none';
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('visible');
    chatButton.style.display = 'flex';
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
        sendMessage(chatInput.value);
        chatInput.value = '';
    }
});

function sendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message user-message';
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate response (replace with actual chat functionality)
    setTimeout(() => {
        const responseElement = document.createElement('div');
        responseElement.className = 'chat-message bot-message';
        responseElement.textContent = 'Thank you for your message. Our team will respond shortly.';
        chatMessages.appendChild(responseElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Cookie Consent
const cookieConsent = document.querySelector('.cookie-consent');
const cookieAccept = document.querySelector('.cookie-accept');
const cookieDecline = document.querySelector('.cookie-decline');

// Check if user has already made a choice
if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieConsent.classList.add('visible');
    }, 2000);
}

cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieConsent.classList.remove('visible');
    initGoogleAnalytics();
});

cookieDecline.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieConsent.classList.remove('visible');
}); 