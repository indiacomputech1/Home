// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .service-item, .feature-item, .stat-item, .value-card, .team-member, .service-detail');
    
    animateElements.forEach(el => {
        if (!el.classList.contains('fade-in') && !el.classList.contains('fade-in-up')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        observer.observe(el);
    });

    // Trigger fade-in-up animations
    const fadeInUpElements = document.querySelectorAll('.fade-in-up');
    const fadeInUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeInUpElements.forEach(el => {
        fadeInUpObserver.observe(el);
    });
});

// Counter animation for statistics
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.textContent.includes('+') ? '+' : '';
    const isMillion = element.textContent.includes('M');
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            if (isMillion) {
                element.textContent = target + 'M' + suffix;
            } else {
                element.textContent = target + suffix;
            }
            clearInterval(timer);
        } else {
            if (isMillion) {
                element.textContent = Math.floor(start) + 'M' + suffix;
            } else {
                element.textContent = Math.floor(start) + suffix;
            }
        }
    }, 16);
};

// Observe statistics section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (target && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statisticsSection = document.querySelector('.statistics');
if (statisticsSection) {
    statsObserver.observe(statisticsSection);
}

// Add active state to navigation links based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active');
    }
});

// Contact Form Handling
// Google Sheets Integration
// Replace this URL with your Google Apps Script Web App URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbxe8P5OsRzUXJo-Yd2WO3enD2z3Am_m4CGWVqP84uFO7ZVKmCq85QV-7UbyG_ZT_SM/exec';

// Attach Google Sheets handler to all contact forms
const contactForms = document.querySelectorAll('form[data-contact=\"true\"]');

if (contactForms.length) {
    contactForms.forEach((contactForm) => {
        const submitBtn = contactForm.querySelector('button[type=\"submit\"], .btn-primary');
        if (!submitBtn) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const originalText = submitBtn.textContent;
            const originalBg = submitBtn.style.background;
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
            
            try {
                // Helper function to format service names
                function formatServiceName(service) {
                if (!service) return '';
                
                // Map of service values to proper display names
                const serviceMap = {
                    'it-infrastructure': 'IT Infrastructure',
                    'digital-solutions': 'AI Driven Digital Solutions',
                    'email-solutions': 'Professional Email Solutions',
                    'backup-security': 'Backup and Security Solutions',
                    'cloud-computing': 'Cloud Computing Solutions',
                    'managed-it': 'Managed IT Services',
                    'event-management': 'Event Management Services',
                    'other': 'Other'
                };
                
                // Return formatted name if in map, otherwise format the string
                if (serviceMap[service]) {
                    return serviceMap[service];
                }
                
                // Fallback: capitalize first letter of each word
                return service.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');
            }
            
                // Get form data
                const formData = new FormData(contactForm);
            
            // Convert FormData to URL-encoded format (avoids CORS issues)
            const urlParams = new URLSearchParams();
            urlParams.append('name', formData.get('name') || '');
            urlParams.append('email', formData.get('email') || '');
            
            // Get phone number as string to preserve leading zeros and full number
            const phoneValue = formData.get('phone') || '';
            const phoneString = phoneValue.toString(); // Ensure it's a string, not a number
            urlParams.append('phone', phoneString);
            
            // Format service name with proper capitalization
            const serviceValue = formData.get('service') || '';
            const formattedService = formatServiceName(serviceValue);
            urlParams.append('service', formattedService);
            
            urlParams.append('message', formData.get('message') || '');
            urlParams.append('timestamp', new Date().toISOString());
            
                console.log('Sending data to Google Sheets:', Object.fromEntries(urlParams));
            
            // Convert to URL-encoded string
            const urlEncodedData = urlParams.toString();
            console.log('URL-encoded data:', urlEncodedData);
            
            // Use XMLHttpRequest for better compatibility with deployed sites
            // URL-encoded format doesn't trigger CORS preflight requests
                const xhr = new XMLHttpRequest();
                xhr.open('POST', scriptURL, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                
                xhr.onload = function() {
                console.log('Response status:', xhr.status);
                console.log('Response text:', xhr.responseText);
                
                // Google Apps Script returns status 200 or 0 for successful submissions
                if (xhr.status === 200 || xhr.status === 0) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        console.log('Response data:', response);
                        
                        if (response.success === false) {
                            // Server returned an error
                            console.error('Server error:', response.error);
                            submitBtn.textContent = 'Error - Try Again';
                            submitBtn.style.background = '#dc3545';
                            submitBtn.style.opacity = '1';
                            submitBtn.style.cursor = 'pointer';
                            
                            showErrorModal('Error: ' + (response.error || 'Failed to save data. Please check your Google Apps Script setup.'));
                            
                            setTimeout(() => {
                                submitBtn.textContent = originalText;
                                submitBtn.style.background = originalBg;
                                submitBtn.disabled = false;
                            }, 3000);
                            return;
                        }
                    } catch (e) {
                        // Response might not be JSON, but status is 200, so assume success
                        console.log('Response is not JSON, but status is OK');
                    }
                    
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.background = '#28a745';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Show animated success modal
                    showSuccessModal();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = originalBg;
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    // If status is not 200 or 0, treat as error
                    console.error('HTTP Error:', xhr.status, xhr.statusText);
                    console.error('Response:', xhr.responseText);
                    submitBtn.textContent = 'Error - Try Again';
                    submitBtn.style.background = '#dc3545';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                    
                    let errorMsg = 'Sorry, there was an error sending your message. ';
                    if (xhr.status === 401) {
                        errorMsg += 'Please check that your Google Apps Script is deployed with "Anyone" access. ';
                    }
                    errorMsg += 'Please try again or contact us directly at indiacomputech1@gmail.com';
                    
                    showErrorModal(errorMsg);
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = originalBg;
                        submitBtn.disabled = false;
                    }, 3000);
                }
                };
                
                xhr.onerror = function() {
                console.error('Network error occurred');
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = '#dc3545';
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                
                showErrorModal('Sorry, there was a network error. Please check your connection and try again, or contact us directly at indiacomputech1@gmail.com');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = originalBg;
                    submitBtn.disabled = false;
                }, 3000);
                };
                
                xhr.ontimeout = function() {
                console.error('Request timeout after 30 seconds');
                console.error('This usually means:');
                console.error('1. Google Apps Script is not responding');
                console.error('2. Script URL might be incorrect');
                console.error('3. Script might not be deployed correctly');
                console.error('4. Script might have an error');
                
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = '#dc3545';
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                
                showErrorModal('Request timed out. This usually means:\n\n' +
                      '1. Google Apps Script is not responding\n' +
                      '2. Please check that your script is deployed correctly\n' +
                      '3. Verify the script URL is correct\n' +
                      '4. Check Apps Script execution log for errors\n\n' +
                      'Please try again or contact us directly at indiacomputech1@gmail.com');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = originalBg;
                    submitBtn.disabled = false;
                }, 3000);
                };
                
                // Set timeout to 30 seconds (Google Apps Script can be slow on first run)
                xhr.timeout = 30000;
                
                console.log('Sending request to:', scriptURL);
                console.log('Request data (URL-encoded):', urlEncodedData);
                
                // Send the request as URL-encoded (no CORS issues)
                xhr.send(urlEncodedData);
                
                console.log('Request sent, waiting for response...');
                
            } catch (error) {
                console.error('Error sending message:', error);
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = '#dc3545';
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                
                showErrorModal('Sorry, there was an error sending your message. Please try again or contact us directly at indiacomputech1@gmail.com');
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = originalBg;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroBackground.style.opacity = `${1 - scrolled / 500}`;
    }
    
    // Parallax for service cards
    const serviceCards = document.querySelectorAll('.service-card, .service-cascade-card');
    serviceCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
            const speed = 0.1 + (index % 3) * 0.05;
            const yPos = -(rect.top - window.innerHeight / 2) * speed;
            card.style.transform = `translateY(${yPos}px)`;
        }
    });
});

// Enhanced scroll reveal animation
const revealElements = document.querySelectorAll('.fade-in-up, .fade-in-down, .slide-in-right, .slide-in-left, .scale-in');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateX(0) scale(1)';
                entry.target.classList.add('revealed');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Stagger animation for service items
const serviceItems = document.querySelectorAll('.service-item, .service-card, .service-cascade-card');
serviceItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.05}s`;
});

// Cursor trail effect (subtle, professional)
let cursorTrail = [];
const maxTrailLength = 5;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) { // Only on desktop
        cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        if (cursorTrail.length > maxTrailLength) {
            cursorTrail.shift();
        }
    }
});

// Enhanced scroll animations with stagger
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .service-item, .feature-item, .stat-item');
    elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !el.classList.contains('animated')) {
            el.classList.add('animated');
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 50);
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Run on load

// Add hover effect to service cards
const serviceCards = document.querySelectorAll('.service-card, .service-item');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Animate numbers on scroll
const animateNumbers = () => {
    const numberElements = document.querySelectorAll('.stat-number[data-target]');
    numberElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        if (target && !el.classList.contains('animated')) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        el.classList.add('animated');
                        animateCounter(el, target);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(el);
        }
    });
};

// Initialize number animations
document.addEventListener('DOMContentLoaded', animateNumbers);

// Services Carousel
const initServicesCarousel = () => {
    const carousel = document.getElementById('servicesCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.service-slide');
    let currentSlide = 0;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    const updateCarousel = () => {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (dots[index]) dots[index].classList.remove('active');
        });
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    };
    
    const goToSlide = (index) => {
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        updateCarousel();
    };
    
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    };
    
    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    };
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto-play carousel
    let autoPlayInterval = setInterval(nextSlide, 4000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carousel.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 4000);
    });
};

// Service Bundles Tabs
const initServiceBundlesTabs = () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
};

// Modal Functions
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    if (modal) {
        if (errorMessage && message) {
            errorMessage.textContent = message;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    
    if (e.target === successModal) {
        closeSuccessModal();
    }
    if (e.target === errorModal) {
        closeErrorModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSuccessModal();
        closeErrorModal();
    }
});

// Service Selector Quiz
let currentQuestion = 1;
const answers = {};

function initServiceSelector() {
    const options = document.querySelectorAll('.selector-option');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            const answer = option.getAttribute('data-answer');
            const questionNum = option.closest('.selector-question').getAttribute('data-question');
            
            // Question 1 allows multiple selections
            if (questionNum === '1') {
                // Toggle selection
                option.classList.toggle('selected');
                
                // Store multiple answers
                if (!answers.q1) {
                    answers.q1 = [];
                }
                
                if (option.classList.contains('selected')) {
                    if (!answers.q1.includes(answer)) {
                        answers.q1.push(answer);
                    }
                } else {
                    answers.q1 = answers.q1.filter(a => a !== answer);
                }
            } else {
                // Questions 2 and 3 are single selection
                // Remove selection from all options in this question
                const questionOptions = option.closest('.selector-question').querySelectorAll('.selector-option');
                questionOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Select this option
                option.classList.add('selected');
                
                // Store answer
                answers[`q${questionNum}`] = answer;
            }
        });
    });
}

function nextQuestion() {
    const currentQ = currentQuestion;
    
    // Validate that at least one answer is selected
    if (currentQ === 1 && (!answers.q1 || answers.q1.length === 0)) {
        alert('Please select at least one challenge');
        return;
    }
    if (currentQ === 2 && !answers.q2) {
        alert('Please select your team size');
        return;
    }
    
    if (currentQuestion < 3) {
        currentQuestion++;
        showQuestion(currentQuestion);
        updateProgress();
    }
}

function previousQuestion() {
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
        updateProgress();
    }
}

function showResultFromQuestion3() {
    // Validate question 3
    if (!answers.q3) {
        alert('Please select your timeline');
        return;
    }
    showResult();
}

// Make functions available globally
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.showResultFromQuestion3 = showResultFromQuestion3;

function showQuestion(num) {
    const questions = document.querySelectorAll('.selector-question');
    questions.forEach(q => q.classList.remove('active'));
    
    const targetQuestion = document.querySelector(`.selector-question[data-question="${num}"]`);
    if (targetQuestion) {
        targetQuestion.classList.add('active');
    }
    
    document.getElementById('currentQuestion').textContent = num;
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progress = (currentQuestion / 3) * 100;
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
}

function showResult() {
    // Hide all questions
    document.querySelectorAll('.selector-question').forEach(q => q.classList.remove('active'));
    
    // Hide progress
    const progress = document.querySelector('.selector-progress');
    if (progress) progress.style.display = 'none';
    
    // Determine recommendation based on answers
    const recommendation = getRecommendation(answers);
    
    // Show result
    const resultDiv = document.getElementById('selectorResult');
    const resultService = document.getElementById('resultService');
    const resultDescription = document.getElementById('resultDescription');
    
    if (resultService) resultService.textContent = recommendation.service;
    if (resultDescription) resultDescription.textContent = recommendation.description;
    if (resultDiv) resultDiv.classList.add('active');
}

function getRecommendation(answers) {
    const challenges = Array.isArray(answers.q1) ? answers.q1 : [answers.q1];
    const teamSize = answers.q2;
    const timeline = answers.q3;
    
    const recommendations = {
        infrastructure: {
            service: 'IT Infrastructure Design & Optimization',
            description: 'We\'ll stabilize your systems, reduce downtime, and build a foundation that scales with your business.',
            priority: 0
        },
        security: {
            service: 'Backup & Security Solutions',
            description: 'Comprehensive security assessments, threat monitoring, and automated backup solutions to protect your business.',
            priority: 0
        },
        cloud: {
            service: 'Cloud Infrastructure Services',
            description: 'Seamless cloud migration with ongoing management, cost optimization, and 24/7 support.',
            priority: 0
        },
        automation: {
            service: 'AI-Driven Digital Solutions',
            description: 'Automate repetitive tasks, streamline workflows, and leverage AI to boost productivity.',
            priority: 0
        }
    };
    
    // Count priorities based on selections
    challenges.forEach(challenge => {
        if (recommendations[challenge]) {
            recommendations[challenge].priority++;
        }
    });
    
    // Find highest priority recommendation
    let topRecommendation = recommendations.infrastructure;
    let maxPriority = 0;
    
    Object.values(recommendations).forEach(rec => {
        if (rec.priority > maxPriority) {
            maxPriority = rec.priority;
            topRecommendation = rec;
        }
    });
    
    // If multiple challenges selected, create custom description
    if (challenges.length > 1) {
        const serviceNames = challenges.map(c => {
            const recs = {
                infrastructure: 'Infrastructure Optimization',
                security: 'Security & Backup',
                cloud: 'Cloud Migration',
                automation: 'AI & Automation'
            };
            return recs[c] || c;
        }).join(', ');
        
        return {
            service: 'Comprehensive IT Solutions Package',
            description: `Based on your needs (${serviceNames}), we recommend a tailored solution combining our expertise in ${challenges.length} key areas to address all your challenges simultaneously.`
        };
    }
    
    return topRecommendation;
}

function resetSelector() {
    currentQuestion = 1;
    Object.keys(answers).forEach(key => delete answers[key]);
    
    // Clear all selections
    document.querySelectorAll('.selector-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Hide result
    const resultDiv = document.getElementById('selectorResult');
    if (resultDiv) resultDiv.classList.remove('active');
    
    // Show first question
    showQuestion(1);
    
    // Show progress
    const progress = document.querySelector('.selector-progress');
    if (progress) progress.style.display = 'block';
    
    // Reset progress bar
    updateProgress();
}

// Make resetSelector available globally
window.resetSelector = resetSelector;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initServicesCarousel();
    initServiceBundlesTabs();
    initServiceSelector();
});
