document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });
    }
    
    // Close mobile menu
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto'; // Enable scrolling when menu is closed
        });
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Handle links with page reference (like index.html#about)
            const hasPageReference = targetId.includes('.html#');
            
            if (hasPageReference) {
                // If we're already on that page, prevent default and scroll to section
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const targetPage = targetId.split('#')[0];
                
                if (currentPage === targetPage) {
                    e.preventDefault();
                    const sectionId = targetId.split('#')[1];
                    scrollToSection('#' + sectionId);
                    
                    // Close mobile menu if it's open
                    if (mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                }
                // Otherwise, let the browser handle the navigation
            } 
            // Handle same-page anchors
            else if (targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                scrollToSection(targetId);
                
                // Close mobile menu if it's open
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    });
    
    function scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const headerOffset = 80; // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Handle desktop navigation
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref.split('#')[0];
        
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Handle mobile navigation similarly
    mobileNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref.split('#')[0];
        
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Initialize sliders or other functionality if needed
    initializeSliders();
});

// Initialize any sliders on the page
function initializeSliders() {
    // Hero slider (if it exists on the page)
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        const dots = document.querySelectorAll('.nav-dot');
        const currentSlideElement = document.querySelector('.current-slide');
        const totalSlidesElement = document.querySelector('.total-slides');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Update total slides count in the UI
        if (totalSlidesElement) {
            totalSlidesElement.textContent = totalSlides.toString().padStart(2, '0');
        }
        
        // Set initial slide counter
        if (currentSlideElement) {
            currentSlideElement.textContent = '01';
        }
        
        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Function to go to a specific slide
        function goToSlide(slideIndex) {
            // Remove active class from all slides and dots
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current slide and dot
            slides[slideIndex].classList.add('active');
            dots[slideIndex].classList.add('active');
            
            // Update current slide counter
            if (currentSlideElement) {
                currentSlideElement.textContent = (slideIndex + 1).toString().padStart(2, '0');
            }
            
            currentSlide = slideIndex;
        }
        
        // Auto-advance slides
        let slideInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % totalSlides;
            goToSlide(nextSlide);
        }, 5000);
        
        // Pause slideshow on hover
        const sliderContainer = document.querySelector('.hero-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    let nextSlide = (currentSlide + 1) % totalSlides;
                    goToSlide(nextSlide);
                }, 5000);
            });
        }
    }
}
