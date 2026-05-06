// Auto-changing search placeholder
const searchInput = document.getElementById('searchInput');
const placeholders = ['Sofa', 'Mattress', 'Chair'];
let currentIndex = 0;

function changePlaceholder() {
    searchInput.placeholder = `Search for ${placeholders[currentIndex]}...`;
    currentIndex = (currentIndex + 1) % placeholders.length;
}

// Change placeholder every 2 seconds
setInterval(changePlaceholder, 2000);

// Hero Carousel
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;
let autoSlideInterval;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Event listeners for carousel
nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
});

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showSlide(index);
        stopAutoSlide();
        startAutoSlide();
    });
});

// Start auto-slide
startAutoSlide();

// Smooth scroll behavior for navigation links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Get target section
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#contact') {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Update active nav on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Optional: Search functionality
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        console.log('Searching for:', searchTerm);
        // Add your search logic here
    }
});

// Allow search on Enter key
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            console.log('Searching for:', searchTerm);
            // Add your search logic here
        }
    }
});

// Wishlist Modal functionality
const wishlistModal = document.getElementById('wishlistModal');
const wishlistIcon = document.getElementById('wishlistIcon');
const wishlistModalClose = document.getElementById('wishlistModalClose');
const wishlistForm = document.getElementById('wishlistForm');

// Open wishlist modal when wishlist icon is clicked
if (wishlistIcon) {
    wishlistIcon.addEventListener('click', function(e) {
        e.preventDefault();
        wishlistModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
}

// Close wishlist modal when close button is clicked
if (wishlistModalClose) {
    wishlistModalClose.addEventListener('click', function() {
        wishlistModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
}

// Close wishlist modal when clicking outside the modal content
wishlistModal.addEventListener('click', function(e) {
    if (e.target === wishlistModal) {
        wishlistModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Handle wishlist form submission
if (wishlistForm) {
    wishlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('wishlistName').value;
        const email = document.getElementById('wishlistEmail').value;
        const phone = document.getElementById('wishlistPhone').value;
        
        console.log('Wishlist created for:', { name, email, phone });
        
        // Show success message
        alert('Thank you! Your wishlist has been created successfully.');
        
        // Reset form and close modal
        wishlistForm.reset();
        wishlistModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Wishlist button functionality (for category pages)
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
    });
});

// Add to cart functionality (for category pages)
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const productName = this.closest('.product-card').querySelector('.product-name').textContent;
        console.log('Added to cart:', productName);
        
        // Visual feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Added!';
        this.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.backgroundColor = '';
        }, 2000);
    });
});
