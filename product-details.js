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
    });
});

// Quantity Selector
const qtyInput = document.querySelector('.qty-input');
const minusBtn = document.querySelector('.qty-btn.minus');
const plusBtn = document.querySelector('.qty-btn.plus');

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

// Add to Cart
const addToCartDetailBtn = document.querySelector('.add-to-cart-detail-btn');

addToCartDetailBtn.addEventListener('click', function() {
    const quantity = qtyInput.value;
    const productName = document.querySelector('.product-title-detail').textContent;
    
    console.log(`Added ${quantity} x ${productName} to cart`);
    
    // Visual feedback
    const originalHTML = this.innerHTML;
    this.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
    this.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        this.innerHTML = originalHTML;
        this.style.backgroundColor = '';
    }, 2000);
});

// Zoom functionality
const zoomBtn = document.querySelector('.zoom-btn');
const mainImageContainer = document.querySelector('.main-image-container');

zoomBtn.addEventListener('click', function() {
    mainImageContainer.classList.toggle('zoomed');
    if (mainImageContainer.classList.contains('zoomed')) {
        mainImage.style.transform = 'scale(1.5)';
        this.innerHTML = '<i class="fas fa-search-minus"></i>';
    } else {
        mainImage.style.transform = 'scale(1)';
        this.innerHTML = '<i class="fas fa-search-plus"></i>';
    }
});
