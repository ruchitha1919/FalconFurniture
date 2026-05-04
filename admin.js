// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation (replace with actual authentication)
        if (email === 'admin@falconfurniture.com' && password === 'admin123') {
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Invalid credentials! Use:\nEmail: admin@falconfurniture.com\nPassword: admin123');
        }
    });
    
    // Toggle Password Visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const icon = this.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
}

// Sidebar Navigation
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.admin-section');

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));
        
        // Show selected section
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.admin-sidebar');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Product Modal
const addProductBtn = document.getElementById('addProductBtn');
if (addProductBtn) {
    addProductBtn.addEventListener('click', function() {
        document.getElementById('productModalTitle').textContent = 'Add Product';
        document.getElementById('productForm').reset();
        openModal('productModal');
    });
}

const productForm = document.getElementById('productForm');
if (productForm) {
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Product saved');
        closeModal('productModal');
        alert('Product saved successfully!');
    });
}

// Category Modal
const addCategoryBtn = document.getElementById('addCategoryBtn');
if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', function() {
        document.getElementById('categoryModalTitle').textContent = 'Add Category';
        document.getElementById('categoryForm').reset();
        openModal('categoryModal');
    });
}

const categoryForm = document.getElementById('categoryForm');
if (categoryForm) {
    categoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Category saved');
        closeModal('categoryModal');
        alert('Category saved successfully!');
    });
}

// Banner Modal
const addBannerBtn = document.getElementById('addBannerBtn');
if (addBannerBtn) {
    addBannerBtn.addEventListener('click', function() {
        document.getElementById('bannerModalTitle').textContent = 'Add Banner';
        document.getElementById('bannerForm').reset();
        openModal('bannerModal');
    });
}

const bannerForm = document.getElementById('bannerForm');
if (bannerForm) {
    bannerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Banner saved');
        closeModal('bannerModal');
        alert('Banner saved successfully!');
    });
}

// Edit Product
function editProduct(id) {
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    // Load product data here
    openModal('productModal');
}

// Delete Product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        console.log('Product deleted:', id);
        alert('Product deleted successfully!');
    }
}

// Edit Category
function editCategory(id) {
    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    // Load category data here
    openModal('categoryModal');
}

// Delete Category
function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        console.log('Category deleted:', id);
        alert('Category deleted successfully!');
    }
}

// Edit Banner
function editBanner(id) {
    document.getElementById('bannerModalTitle').textContent = 'Edit Banner';
    // Load banner data here
    openModal('bannerModal');
}

// Delete Banner
function deleteBanner(id) {
    if (confirm('Are you sure you want to delete this banner?')) {
        console.log('Banner deleted:', id);
        alert('Banner deleted successfully!');
    }
}

// Close modal on overlay click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});
