// Cart Management
let cart = JSON.parse(localStorage.getItem('falconCart')) || [];

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
const colorBtns = document.querySelectorAll('.color-btn');

colorBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        colorBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

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
        const quantity = parseInt(qtyInput.value);
        const productName = document.querySelector('.product-title-detail').textContent;
        const productPrice = document.querySelector('.current-price-detail').textContent;
        const productImage = mainImage.src;
        
        // Get selected color
        const selectedColor = document.querySelector('.color-btn.active');
        const colorTitle = selectedColor ? selectedColor.getAttribute('title') : 'Default';
        
        // Create product object
        const product = {
            id: Date.now(), // Simple unique ID
            name: productName,
            price: productPrice,
            quantity: quantity,
            color: colorTitle,
            image: productImage
        };
        
        // Add to cart
        cart.push(product);
        
        // Save to localStorage
        localStorage.setItem('falconCart', JSON.stringify(cart));
        
        // Update cart badge
        updateCartBadge();
        
        console.log(`Added ${quantity} x ${productName} (${colorTitle}) to cart`);
        console.log('Current cart:', cart);
        
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

// Related Products - Add to Cart
const relatedAddToCartBtns = document.querySelectorAll('.related-products-section .add-to-cart-btn');

relatedAddToCartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productImage = productCard.querySelector('.product-image').src;
        
        // Create product object
        const product = {
            id: Date.now(),
            name: productName,
            price: productPrice,
            quantity: 1,
            color: 'Default',
            image: productImage
        };
        
        // Add to cart
        cart.push(product);
        
        // Save to localStorage
        localStorage.setItem('falconCart', JSON.stringify(cart));
        
        // Update cart badge
        updateCartBadge();
        
        console.log(`Added ${productName} to cart`);
        
        // Visual feedback
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Added!';
        this.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            this.innerHTML = originalHTML;
            this.style.backgroundColor = '';
        }, 2000);
    });
});
