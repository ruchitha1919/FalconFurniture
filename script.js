// ============================================
// USER AUTHENTICATION SYSTEM
// ============================================

// Current logged-in user
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Get all users from localStorage
function getAllUsers() {
    return JSON.parse(localStorage.getItem('falconUsers')) || [];
}

// Save all users to localStorage
function saveAllUsers(users) {
    localStorage.setItem('falconUsers', JSON.stringify(users));
}

// Get user-specific data key
function getUserDataKey(userId, dataType) {
    return `falcon_${userId}_${dataType}`;
}

// Get current user's cart
function getUserCart() {
    if (!currentUser) return [];
    return JSON.parse(localStorage.getItem(getUserDataKey(currentUser.id, 'cart'))) || [];
}

// Save current user's cart
function saveUserCart(cart) {
    if (!currentUser) return;
    localStorage.setItem(getUserDataKey(currentUser.id, 'cart'), JSON.stringify(cart));
}

// Get current user's wishlist
function getUserWishlist() {
    if (!currentUser) return [];
    return JSON.parse(localStorage.getItem(getUserDataKey(currentUser.id, 'wishlist'))) || [];
}

// Save current user's wishlist
function saveUserWishlist(wishlist) {
    if (!currentUser) return;
    localStorage.setItem(getUserDataKey(currentUser.id, 'wishlist'), JSON.stringify(wishlist));
}

// Cart and Wishlist Management (User-specific)
let cart = getUserCart();
let wishlist = getUserWishlist();

// Firebase products loading
let products = [];

// Define categories with images
const CATEGORIES = [
    {
        name: 'Sofas',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&q=90',
        icon: 'fas fa-couch'
    },
    {
        name: 'Sofa Cum Beds',
        image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=500&h=500&fit=crop&q=90',
        icon: 'fas fa-bed'
    },
    {
        name: 'Coffee Tables',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&h=500&fit=crop&q=90',
        icon: 'fas fa-table'
    },
    {
        name: 'Beds',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop&q=90',
        icon: 'fas fa-bed'
    },
    {
        name: 'Wardrobes',
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&h=500&fit=crop&q=90',
        icon: 'fas fa-door-open'
    },
    {
        name: 'TV Units',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=90',
        icon: 'fas fa-tv'
    },
    {
        name: 'Recliners',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&q=90',
        icon: 'fas fa-chair'
    },
    {
        name: 'Dining Sets',
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=500&fit=crop&q=90',
        icon: 'fas fa-utensils'
    },
    {
        name: 'Lounge Chairs',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop&q=90',
        icon: 'fas fa-chair'
    },
    {
        name: 'Mattresses',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=500&fit=crop&q=90',
        icon: 'fas fa-bed'
    }
];

console.log('Script.js loaded');

// ============================================
// CATEGORY MANAGEMENT
// ============================================

// Render categories
function renderCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    if (!categoryGrid) return;
    
    categoryGrid.innerHTML = CATEGORIES.map(category => {
        const categoryProducts = products.filter(p => p.category === category.name);
        const productCount = categoryProducts.length;
        
        return `
            <div class="category-card" onclick="openCategoryModal('${category.name}')">
                <div class="category-image">
                    <img src="${category.image}" alt="${category.name}">
                </div>
                <div class="category-info">
                    <div class="category-text">
                        <h3 class="category-title">${category.name}</h3>
                        <p class="category-count">${productCount} Product${productCount !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Open category modal
function openCategoryModal(categoryName) {
    const modal = document.getElementById('categoryModal');
    const modalTitle = document.getElementById('categoryModalTitle');
    const productsGrid = document.getElementById('categoryProductsGrid');
    
    if (!modal || !modalTitle || !productsGrid) return;
    
    // Set title
    modalTitle.textContent = categoryName;
    
    // Filter products by category
    let categoryProducts = [];
    
    categoryProducts = products.filter(p => p.category === categoryName);
    
    // Render products
    if (categoryProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="category-empty" style="grid-column: 1/-1;">
                <i class="fas fa-box-open"></i>
                <h3>No Products Yet</h3>
                <p>Products in this category will appear here soon</p>
            </div>
        `;
    } else {
        productsGrid.innerHTML = categoryProducts.map(product => {
            const isInWishlist = wishlist.some(item => item.id === product.id);
            return `
                <div class="product-card">
                    <div class="product-image-wrapper">
                        <button class="wishlist-icon-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(event, '${product.id}')">
                            <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
                        <img src="${product.image}" alt="${product.name}" class="product-image" onclick="goToProductDetails('${product.id}')">
                    </div>
                    <div class="product-info" onclick="goToProductDetails('${product.id}')">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">
                            <span class="current-price">₹${formatPrice(product.price)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close category modal
const categoryModalClose = document.getElementById('categoryModalClose');
const categoryModal = document.getElementById('categoryModal');

if (categoryModalClose) {
    categoryModalClose.addEventListener('click', function() {
        categoryModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

if (categoryModal) {
    categoryModal.addEventListener('click', function(e) {
        if (e.target === categoryModal) {
            categoryModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ============================================
// AUTHENTICATION UI HANDLERS
// ============================================

// Initialize authentication UI on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthUI();
    setupAuthEventListeners();
    
    // Load categories
    if (document.getElementById('categoryGrid')) {
        renderCategories();
    }
});

function initializeAuthUI() {
    updateUserUIState();
    updateWishlistBadge();
    updateCartBadge();
}

function updateUserUIState() {
    const userProfileIcon = document.getElementById('userProfileIcon');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (currentUser) {
        // User is logged in
        if (userProfileIcon) {
            userProfileIcon.classList.add('user-logged-in');
            userProfileIcon.querySelector('i').classList.remove('far');
            userProfileIcon.querySelector('i').classList.add('fas');
        }
        
        if (profileName) profileName.textContent = currentUser.name;
        if (profileEmail) profileEmail.textContent = currentUser.email;
        if (profileAvatar) profileAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    } else {
        // User is not logged in
        if (userProfileIcon) {
            userProfileIcon.classList.remove('user-logged-in');
            userProfileIcon.querySelector('i').classList.remove('fas');
            userProfileIcon.querySelector('i').classList.add('far');
        }
    }
}

function setupAuthEventListeners() {
    // User profile icon click
    const userProfileIcon = document.getElementById('userProfileIcon');
    const userProfileDropdown = document.getElementById('userProfileDropdown');
    const authModal = document.getElementById('authModal');
    
    if (userProfileIcon) {
        userProfileIcon.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (currentUser) {
                // Show profile dropdown
                const isVisible = userProfileDropdown.style.display === 'block';
                userProfileDropdown.style.display = isVisible ? 'none' : 'block';
            } else {
                // Show login modal
                showAuthModal('login');
            }
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (userProfileDropdown && !userProfileIcon.contains(e.target) && !userProfileDropdown.contains(e.target)) {
            userProfileDropdown.style.display = 'none';
        }
    });
    
    // Auth modal close button
    const authModalClose = document.getElementById('authModalClose');
    if (authModalClose) {
        authModalClose.addEventListener('click', function() {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close auth modal when clicking outside
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Toggle between login and signup
    const showSignupLink = document.getElementById('showSignupLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const signupFormContainer = document.getElementById('signupFormContainer');
    
    if (showSignupLink) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginFormContainer.style.display = 'none';
            signupFormContainer.style.display = 'block';
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            signupFormContainer.style.display = 'none';
            loginFormContainer.style.display = 'block';
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // View wishlist from profile dropdown
    const viewWishlistLink = document.getElementById('viewWishlistLink');
    if (viewWishlistLink) {
        viewWishlistLink.addEventListener('click', function(e) {
            e.preventDefault();
            userProfileDropdown.style.display = 'none';
            showWishlistItems();
        });
    }
}

function showAuthModal(mode = 'login') {
    const authModal = document.getElementById('authModal');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const signupFormContainer = document.getElementById('signupFormContainer');
    
    if (mode === 'login') {
        loginFormContainer.style.display = 'block';
        signupFormContainer.style.display = 'none';
    } else {
        loginFormContainer.style.display = 'none';
        signupFormContainer.style.display = 'block';
    }
    
    authModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login successful
        currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Load user's cart and wishlist
        cart = getUserCart();
        wishlist = getUserWishlist();
        
        // Update UI
        updateUserUIState();
        updateWishlistBadge();
        updateCartBadge();
        
        // Close modal
        document.getElementById('authModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        document.getElementById('loginForm').reset();
        
        // Show success message
        alert(`Welcome back, ${currentUser.name}!`);
        
        // Re-render products if on homepage
        if (document.getElementById('productGrid')) {
            renderProducts();
        }
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    const users = getAllUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        alert('An account with this email already exists. Please login.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveAllUsers(users);
    
    // Auto-login the new user
    currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Initialize empty cart and wishlist for new user
    cart = [];
    wishlist = [];
    saveUserCart(cart);
    saveUserWishlist(wishlist);
    
    // Update UI
    updateUserUIState();
    updateWishlistBadge();
    updateCartBadge();
    
    // Close modal
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('signupForm').reset();
    
    // Show success message
    alert(`Welcome to Falcon Furniture, ${currentUser.name}! Your account has been created successfully.`);
    
    // Re-render products if on homepage
    if (document.getElementById('productGrid')) {
        renderProducts();
    }
}

function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        // Clear current user
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Clear cart and wishlist
        cart = [];
        wishlist = [];
        
        // Update UI
        updateUserUIState();
        updateWishlistBadge();
        updateCartBadge();
        
        // Hide dropdown
        document.getElementById('userProfileDropdown').style.display = 'none';
        
        // Show message
        alert('You have been logged out successfully.');
        
        // Re-render products if on homepage
        if (document.getElementById('productGrid')) {
            renderProducts();
        }
    }
}

// ============================================
// ORIGINAL CODE CONTINUES
// ============================================

// Wait for Firebase to be ready
function initializeProducts() {
    const USE_FIREBASE = typeof firebase !== 'undefined' && typeof firebaseDatabase !== 'undefined';
    
    console.log('Firebase available:', typeof firebase !== 'undefined');
    console.log('Firebase Database:', typeof firebaseDatabase !== 'undefined');

    // Load products from Firebase or use default products
    function loadProducts() {
        const productGrid = document.getElementById('productGrid');
        
        if (!productGrid) {
            console.log('Product grid not found');
            return;
        }

        console.log('Loading products...');

        if (USE_FIREBASE) {
            console.log('Loading from Firebase...');
            // Load from Firebase
            const productsRef = firebaseDatabase.ref('products');
            productsRef.on('value', (snapshot) => {
                products = [];
                snapshot.forEach((childSnapshot) => {
                    products.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                console.log('Firebase products loaded:', products.length);
                console.log('Products:', products);
                
                // If no Firebase products, use defaults
                if (products.length === 0) {
                    console.log('No Firebase products, using defaults');
                    products = getDefaultProducts();
                }
                renderProducts();
            }, (error) => {
                console.error('Firebase error:', error);
                products = getDefaultProducts();
                renderProducts();
            });
        } else {
            console.log('Firebase not available, using default products');
            // Use default products if Firebase not available
            products = getDefaultProducts();
            renderProducts();
        }
    }

    // Initialize products on page load
    if (document.getElementById('productGrid')) {
        loadProducts();
        updateWishlistBadge();
    }
}

// Wait for DOM and Firebase to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeProducts, 500); // Wait for Firebase to initialize
    });
} else {
    setTimeout(initializeProducts, 500); // Wait for Firebase to initialize
}

// Render products to the grid
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    console.log('Rendering products:', products.length);

    if (products.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #999;">
                <i class="fas fa-box-open" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></i>
                <p style="font-size: 18px;">No products available yet</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = products.map(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        
        return `
            <div class="product-card">
                <div class="product-image-wrapper">
                    <button class="wishlist-icon-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(event, '${product.id}')">
                        <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
                    <img src="${product.image}" alt="${product.name}" class="product-image" onclick="goToProductDetails('${product.id}')">
                </div>
                <div class="product-info" onclick="goToProductDetails('${product.id}')">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">₹${formatPrice(product.price)}</span>
                        ${hasDiscount ? `
                            <span class="original-price">₹${formatPrice(product.originalPrice)}</span>
                            <span class="discount">${product.discount}% OFF</span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Update categories after products are rendered
    if (document.getElementById('categoryGrid')) {
        renderCategories();
    }
}

// Toggle wishlist
function toggleWishlist(event, productId) {
    event.stopPropagation();
    
    // Check if user is logged in
    if (!currentUser) {
        alert('Please login to add items to your wishlist.');
        showAuthModal('login');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        
        // Save to user's wishlist
        saveUserWishlist(wishlist);
        
        // Update wishlist badge
        updateWishlistBadge();
        
        // Re-render products to update wishlist icons
        renderProducts();
    } else {
        // Add to wishlist
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        
        // Save to user's wishlist
        saveUserWishlist(wishlist);
        
        // Update wishlist badge
        updateWishlistBadge();
        
        // Re-render products to update wishlist icons
        renderProducts();
        
        // Show success message
        const btn = event.currentTarget;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = 'rgba(39, 174, 96, 0.98)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 1000);
    }
}

// Update wishlist badge
function updateWishlistBadge() {
    const wishlistBadge = document.getElementById('wishlistBadge');
    if (wishlistBadge) {
        if (wishlist.length > 0) {
            wishlistBadge.textContent = wishlist.length;
            wishlistBadge.style.display = 'flex';
        } else {
            wishlistBadge.style.display = 'none';
        }
    }
}

// Go to product details
function goToProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add to cart function
function addToCart(productId) {
    // Check if user is logged in
    if (!currentUser) {
        alert('Please login to add items to your cart.');
        showAuthModal('login');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveUserCart(cart);
    updateCartBadge();
    
    alert('Product added to cart!');
}

// Default products (fallback) - REMOVED: Only show products from admin dashboard
function getDefaultProducts() {
    return [];
}

// Update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// Initialize cart badge on page load
updateCartBadge();

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

// Wishlist Items Modal
const wishlistItemsModal = document.getElementById('wishlistItemsModal');
const wishlistItemsModalClose = document.getElementById('wishlistItemsModalClose');
const wishlistItemsContainer = document.getElementById('wishlistItemsContainer');

// Open wishlist items modal when navbar wishlist icon is clicked
if (wishlistIcon) {
    wishlistIcon.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if user is logged in
        if (!currentUser) {
            alert('Please login to view your wishlist.');
            showAuthModal('login');
            return;
        }
        
        showWishlistItems();
    });
}

// Function to show wishlist items
function showWishlistItems() {
    if (!wishlistItemsModal || !wishlistItemsContainer) return;
    
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #999;">
                <i class="fas fa-heart-broken" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></i>
                <p style="font-size: 18px; margin-bottom: 10px;">Your wishlist is empty</p>
                <p style="font-size: 14px;">Add products to your wishlist by clicking the heart icon</p>
            </div>
        `;
    } else {
        wishlistItemsContainer.innerHTML = `
            <div class="wishlist-items-grid">
                ${wishlist.map(item => `
                    <div class="wishlist-item-card">
                        <button class="remove-wishlist-btn" onclick="removeFromWishlistModal('${item.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                        <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
                        <div class="wishlist-item-info">
                            <h4>${item.name}</h4>
                            <p class="wishlist-item-price">₹${formatPrice(item.price)}</p>
                            <button class="view-product-btn" onclick="goToProductDetails('${item.id}')">
                                View Product
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; margin-bottom: 15px;">Total Items: ${wishlist.length}</p>
            </div>
        `;
    }
    
    wishlistItemsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Remove item from wishlist in modal
function removeFromWishlistModal(productId) {
    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveUserWishlist(wishlist);
        updateWishlistBadge();
        showWishlistItems(); // Refresh the modal
        
        // Re-render products if on homepage
        if (document.getElementById('productGrid')) {
            renderProducts();
        }
    }
}

// Close wishlist items modal
if (wishlistItemsModalClose) {
    wishlistItemsModalClose.addEventListener('click', function() {
        wishlistItemsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close wishlist items modal when clicking outside
if (wishlistItemsModal) {
    wishlistItemsModal.addEventListener('click', function(e) {
        if (e.target === wishlistItemsModal) {
            wishlistItemsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Open wishlist form modal (used when adding products)
function showWishlistForm() {
    if (wishlistModal) {
        wishlistModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close wishlist form modal when close button is clicked
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
    wishlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('wishlistName').value;
        const email = document.getElementById('wishlistEmail').value;
        const phone = document.getElementById('wishlistPhone').value;
        
        // Prepare wishlist data
        const wishlistData = {
            name: name,
            email: email,
            phone: phone,
            items: wishlist, // Current wishlist items
            createdAt: Date.now(),
            timestamp: new Date().toISOString()
        };
        
        console.log('Saving wishlist to Firebase:', wishlistData);
        
        // Save to Firebase if available
        const USE_FIREBASE = typeof firebase !== 'undefined' && typeof firebaseDatabase !== 'undefined';
        
        if (USE_FIREBASE) {
            try {
                const wishlistsRef = firebaseDatabase.ref('wishlists');
                await wishlistsRef.push(wishlistData);
                
                console.log('Wishlist saved to Firebase successfully');
                
                // Show success message with product count
                const itemCount = wishlist.length;
                alert(`Thank you, ${name}! Your wishlist with ${itemCount} item(s) has been saved successfully. We will contact you soon at ${email}!`);
            } catch (error) {
                console.error('Error saving wishlist to Firebase:', error);
                alert(`Thank you, ${name}! Your wishlist has been created locally.`);
            }
        } else {
            console.log('Firebase not available, wishlist saved locally');
            const itemCount = wishlist.length;
            alert(`Thank you, ${name}! Your wishlist with ${itemCount} item(s) has been created successfully.`);
        }
        
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
