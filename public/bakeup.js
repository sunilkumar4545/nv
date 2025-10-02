// Ensure DOM is fully loaded before initializing functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing scripts...');
    
    // Mobile Menu Functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeBtn = document.getElementById('closeBtn');

    // Hero Slider Functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');
    const currentSlideSpan = document.querySelector('.current-slide');
    const totalSlides = slides.length;

    // Debug logging
    console.log('Mobile menu elements:', {
        mobileMenuBtn: !!mobileMenuBtn,
        mobileMenu: !!mobileMenu,
        closeBtn: !!closeBtn
    });
    
    console.log('Slider elements:', {
        slides: slides.length,
        navDots: navDots.length,
        currentSlideSpan: !!currentSlideSpan
    });

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        navDots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        navDots[index].classList.add('active');
        
        // Update counter
        if (currentSlideSpan) {
            currentSlideSpan.textContent = String(index + 1).padStart(2, '0');
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Initialize slider if elements exist
    if (slides.length > 0 && navDots.length > 0) {
        // Auto-advance slides
        setInterval(nextSlide, 5000);

        // Navigation dots click handlers
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Keyboard navigation for slider
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
    }

    // Mobile Menu Event Listeners
    if (mobileMenuBtn && mobileMenu && closeBtn) {
        // Open mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            console.log('Mobile menu button clicked');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close mobile menu
        closeBtn.addEventListener('click', () => {
            console.log('Close button clicked');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close mobile menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    } else {
        console.error('Mobile menu elements not found:', {
            mobileMenuBtn: !!mobileMenuBtn,
            mobileMenu: !!mobileMenu,
            closeBtn: !!closeBtn
        });
    }

    // Navigation active state
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Function to set active link based on scroll position
    function setActiveLink() {
        let scrollPosition = window.scrollY + 100; // Offset for header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Open mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close mobile menu
    closeBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scrolling
    });
    
    // Handle mobile menu link clicks
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto'; // Enable scrolling
        });
    });
    
    // Add scroll event listener
    window.addEventListener('scroll', setActiveLink);
    
    // Set active link on page load
    setActiveLink();
    
    // Handle hash change (for when links are clicked)
    window.addEventListener('hashchange', function() {
        setActiveLink();
    });
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Calculate position with header offset
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Move all the remaining code inside the DOMContentLoaded event listener
    
    // Smooth scrolling for navigation links
    const navLinks2 = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks2.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Add smooth scrolling logic here if needed
        });
    });

    // Gallery item hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '1';
        });
    });

    // Floating action button interactions
    const fabs = document.querySelectorAll('.fab');
    fabs.forEach(fab => {
        fab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = fab.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            fab.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple effect styles
    const style = document.createElement('style');
    style.textContent = `
        .fab {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Intersection Observer for animations
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

    // Observe gallery items for scroll animations
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Keyboard navigation for mobile menu escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Preload images for better performance
    const imageUrls = [
        'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1040879/pexels-photo-1040879.jpeg?auto=compress&cs=tinysrgb&w=600'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    // Initialize InfiniteScrollText (it will be defined in index.html)
    // This is just a placeholder reference since InfiniteScrollText is in the HTML file
    
    console.log('All scripts initialized successfully');
}); // Close DOMContentLoaded event listener

// Performance optimization: Debounce function
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

// Window load event for final optimizations
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('Page fully loaded');
});


    // Smooth scrolling for navigation links (only for internal anchors)
    const navLinks2 = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks2.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Only prevent default for internal anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                // Smooth scrolling is already handled by the anchor link handler above
            }
            // For external links (gallery.html, video.html), do nothing - let them navigate normally
        });
    });