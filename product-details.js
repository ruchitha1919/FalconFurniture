// Firebase or localStorage fallback
const USE_FIREBASE = typeof firebase !== 'undefined' && typeof firebaseDatabase !== 'undefined';

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let currentProduct = null;
let allProducts = [];

// Cart Management
let cart = JSON.parse(localStorage.getItem('falconCart')) || [];

// Load product data
function loadProductData() {
    if (!productId) {
        console.error('No product ID provided');
        showErrorMessage();
        return;
    }

    if (USE_FIREBASE) {
        // Load from Firebase
        const productsRef = firebaseDatabase.ref('products');
        productsRef.once('value', (snapshot) => {
            allProducts = [];
            snapshot.forEach((childSnapshot) => {
                const product = {
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                };
                allProducts.push(product);
                
                if (product.id === productId) {
                    currentProduct = product;
                }
            });
            
            if (currentProduct) {
                renderProductDetails(currentProduct);
                renderRelatedProducts(currentProduct.category);
            } else {
                showErrorMessage();
            }
        });
    } else {
        // Load from localStorage
        allProducts = JSON.parse(localStorage.getItem('falconProducts')) || [];
        currentProduct = allProducts.find(p => p.id === productId);
        
        if (currentProduct) {
            renderProductDetails(currentProduct);
            renderRelatedProducts(currentProduct.category);
        } else {
            showErrorMessage();
        }
    }
}

// Render product details
function renderProductDetails(product) {
    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb span');
    if (breadcrumb) {
        breadcrumb.textContent = product.name;
    }
    
    const categoryLink = document.querySelector('.breadcrumb a:nth-child(3)');
    if (categoryLink) {
        categoryLink.textContent = product.category || 'Products';
    }
    
    // Update main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }
    
    // Update thumbnails (use same image for now)
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.src = product.image;
        thumb.alt = product.name;
    });
    
    // Update product title
    const title = document.querySelector('.product-title-detail');
    if (title) {
        title.textContent = product.name;
    }
    
    // Update badge
    const badge = document.querySelector('.product-badge-detail');
    if (badge) {
        if (product.badge) {
            badge.textContent = product.badge;
            badge.className = `product-badge-detail ${product.badge.toLowerCase()}`;
        } else {
            badge.style.display = 'none';
        }
    }
    
    // Update prices
    const currentPrice = document.querySelector('.current-price-detail');
    const originalPrice = document.querySelector('.original-price-detail');
    const discount = document.querySelector('.discount-detail');
    
    if (currentPrice) {
        currentPrice.textContent = `₹${formatPrice(product.price)}`;
    }
    
    if (product.originalPrice && product.originalPrice > product.price) {
        if (originalPrice) {
            originalPrice.textContent = `₹${formatPrice(product.originalPrice)}`;
            originalPrice.style.display = 'inline';
        }
        if (discount && product.discount) {
            discount.textContent = `${product.discount}% OFF`;
            discount.style.display = 'inline';
        }
    } else {
        if (originalPrice) originalPrice.style.display = 'none';
        if (discount) discount.style.display = 'none';
    }
    
    // Update description
    const description = document.querySelector('.product-description');
    if (description && product.description) {
        description.textContent = product.description;
    }
    
    // Update color options
    const colorOptions = document.querySelector('.color-options');
    if (colorOptions && product.color) {
        const colors = product.color.split(',').map(c => c.trim());
        colorOptions.innerHTML = colors.map((color, index) => {
            const colorCode = getColorCode(color);
            return `<button class="color-btn ${index === 0 ? 'active' : ''}" 
                            style="background-color: ${colorCode};" 
                            title="${color}"></button>`;
        }).join('');
        
        // Re-attach color button listeners
        attachColorListeners();
    }
    
    // Update stock in quantity selector
    const qtyInput = document.querySelector('.qty-input');
    if (qtyInput && product.stock) {
        qtyInput.max = product.stock;
    }
}

// Helper function to get color codes
function getColorCode(colorName) {
    const colorMap = {
        'brown': '#8B7355',
        'gray': '#4A4A4A',
        'grey': '#4A4A4A',
        'navy': '#2C3E50',
        'beige': '#E8E8E8',
        'black': '#000000',
        'white': '#FFFFFF',
        'blue': '#3498db',
        'green': '#27ae60',
        'red': '#e74c3c',
        'yellow': '#f1c40f',
        'orange': '#e67e22',
        'purple': '#9b59b6',
        'pink': '#fd79a8',
        'cream': '#FAF7F2'
    };
    
    return colorMap[colorName.toLowerCase()] || '#8B7355';
}

// Format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Render related products
function renderRelatedProducts(category) {
    const relatedGrid = document.querySelector('.related-products-grid');
    if (!relatedGrid) return;
    
    // Filter products by same category, exclude current product
    const relatedProducts = allProducts
        .filter(p => p.category === category && p.id !== productId)
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        relatedGrid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">No related products found</p>';
        return;
    }
    
    relatedGrid.innerHTML = relatedProducts.map(product => {
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        
        return `
            <div class="product-card" onclick="window.location.href='product-details.html?id=${product.id}'">
                <div class="product-image-wrapper">
                    ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
                    <button class="wishlist-btn" onclick="event.stopPropagation();">
                        <i class="far fa-heart"></i>
                    </button>
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">₹${formatPrice(product.price)}</span>
                        ${hasDiscount ? `<span class="original-price">₹${formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Show error message
function showErrorMessage() {
    const container = document.querySelector('.product-details-section .container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 100px 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 64px; color: #e74c3c; margin-bottom: 20px;"></i>
                <h2 style="font-size: 28px; margin-bottom: 10px;">Product Not Found</h2>
                <p style="color: #666; margin-bottom: 30px;">The product you're looking for doesn't exist.</p>
                <a href="index.html" style="background: #8B5E3C; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block;">
                    Back to Home
                </a>
            </div>
        `;
    }
}

// Update cart badge
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
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

// Image Gallery - Thumbnail Click
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('mainImage');

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Change main image
        mainImage.src = this.src.replace('w=200&h=200', 'w=800&h=800');
        
        // Update magnifier background
        magnifierBox.style.backgroundImage = `url('${mainImage.src.replace('w=800&h=800', 'w=1600&h=1600')}')`;
    });
});

// Mouse Magnifier Functionality
const mainImageContainer = document.getElementById('mainImageContainer');
const magnifierBox = document.getElementById('magnifierBox');

mainImageContainer.addEventListener('mousemove', function(e) {
    const rect = mainImageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Position the magnifier box (square box that follows mouse)
    const magnifierSize = 200;
    let magnifierX = x - magnifierSize / 2;
    let magnifierY = y - magnifierSize / 2;
    
    // Keep magnifier within image bounds
    if (magnifierX < 0) magnifierX = 0;
    if (magnifierY < 0) magnifierY = 0;
    if (magnifierX > rect.width - magnifierSize) magnifierX = rect.width - magnifierSize;
    if (magnifierY > rect.height - magnifierSize) magnifierY = rect.height - magnifierSize;
    
    magnifierBox.style.left = magnifierX + 'px';
    magnifierBox.style.top = magnifierY + 'px';
    
    // Calculate background position for 3x zoom effect
    const zoomLevel = 3;
    const bgPosX = -(magnifierX * zoomLevel);
    const bgPosY = -(magnifierY * zoomLevel);
    
    magnifierBox.style.backgroundImage = `url('${mainImage.src.replace('w=800&h=800', 'w=1600&h=1600')}')`;
    magnifierBox.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
});

mainImageContainer.addEventListener('mouseleave', function() {
    magnifierBox.style.opacity = '0';
});

mainImageContainer.addEventListener('mouseenter', function() {
    magnifierBox.style.opacity = '1';
});

// Quantity Selector
const qtyInput = document.querySelector('.qty-input');
const minusBtn = document.querySelector('.qty-btn.minus');
const plusBtn = document.querySelector('.qty-btn.plus');

if (minusBtn && plusBtn && qtyInput) {
    minusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value);
        let maxValue = parseInt(qtyInput.max);
        if (currentValue < maxValue) {
            qtyInput.value = currentValue + 1;
        }
    });
}

// Color Selection
function attachColorListeners() {
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            colorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Initial color listeners
attachColorListeners();

// Wishlist Toggle
const wishlistDetailBtn = document.querySelector('.wishlist-detail-btn');

if (wishlistDetailBtn) {
    wishlistDetailBtn.addEventListener('click', function() {
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
}

// Add to Cart Functionality
const addToCartDetailBtn = document.querySelector('.add-to-cart-detail-btn');

if (addToCartDetailBtn) {
    addToCartDetailBtn.addEventListener('click', function() {
        if (!currentProduct) {
            alert('Product data not loaded');
            return;
        }
        
        const quantity = parseInt(qtyInput.value);
        
        // Get selected color
        const selectedColor = document.querySelector('.color-btn.active');
        const colorTitle = selectedColor ? selectedColor.getAttribute('title') : 'Default';
        
        // Create product object
        const product = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            quantity: quantity,
            color: colorTitle,
            image: currentProduct.image
        };
        
        // Check if product with same color already exists in cart
        const existingIndex = cart.findIndex(item => item.id === product.id && item.color === product.color);
        
        if (existingIndex > -1) {
            // Update quantity
            cart[existingIndex].quantity += quantity;
        } else {
            // Add new item
            cart.push(product);
        }
        
        // Save to localStorage
        localStorage.setItem('falconCart', JSON.stringify(cart));
        
        // Update cart badge
        updateCartBadge();
        
        console.log(`Added ${quantity} x ${product.name} (${colorTitle}) to cart`);
        
        // Visual feedback
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        this.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            this.innerHTML = originalHTML;
            this.style.backgroundColor = '';
        }, 2000);
    });
}

// Initialize page
loadProductData();
