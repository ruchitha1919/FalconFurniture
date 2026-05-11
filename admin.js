// Admin credentials (in production, this should be server-side)
const ADMIN_CREDENTIALS = {
    email: 'admin@falconfurniture.com',
    password: 'admin123'
};

// Check if on login page
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Handle login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Show error if fields are empty
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }

        // Validate credentials
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            // Set admin session
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminEmail', email);
            
            // Redirect to dashboard
            window.location.href = 'admin-dashboard.html';
        } else {
            showError('Invalid email or password');
        }
    });

    function showError(message) {
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            loginForm.insertBefore(errorDiv, loginForm.firstChild);
        }
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 3000);
    }
}

// Check if on dashboard page
if (document.getElementById('adminDashboard')) {
    // Check authentication
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
    }

    // Initialize dashboard
    const adminEmail = localStorage.getItem('adminEmail');
    document.getElementById('adminEmail').textContent = adminEmail;
    document.getElementById('adminInitial').textContent = adminEmail.charAt(0).toUpperCase();

    // Load products from localStorage
    let products = JSON.parse(localStorage.getItem('falconProducts')) || [];
    let banners = JSON.parse(localStorage.getItem('falconBanners')) || [];

    // Menu navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.dataset.section;
            
            // Update active menu
            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            contentSections.forEach(s => s.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminEmail');
            window.location.href = 'admin-login.html';
        }
    });

    // Product Management
    const productForm = document.getElementById('productForm');
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const imageUploadArea = document.querySelector('.image-upload');

    // Image upload preview
    imageUploadArea.addEventListener('click', () => imageInput.click());
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.add('show');
            };
            reader.readAsDataURL(file);
        }
    });

    // Add/Edit Product
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('productId').value;
        const product = {
            id: productId || Date.now(),
            name: document.getElementById('productName').value,
            price: document.getElementById('productPrice').value,
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            stock: document.getElementById('productStock').value,
            image: imagePreview.src || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'
        };

        if (productId) {
            // Update existing product
            const index = products.findIndex(p => p.id == productId);
            products[index] = product;
        } else {
            // Add new product
            products.push(product);
        }

        // Save to localStorage
        localStorage.setItem('falconProducts', JSON.stringify(products));
        
        // Reset form
        productForm.reset();
        imagePreview.classList.remove('show');
        document.getElementById('productId').value = '';
        
        // Refresh product list
        renderProducts();
        
        alert('Product saved successfully!');
    });

    // Render products table
    function renderProducts() {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = products.map(product => `
            <tr>
                <td><img src="${product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>₹${product.price}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-edit" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Update stats
        updateStats();
    }

    // Edit product
    window.editProduct = function(id) {
        const product = products.find(p => p.id == id);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productStock').value = product.stock;
            imagePreview.src = product.image;
            imagePreview.classList.add('show');
            
            // Scroll to form
            productForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Delete product
    window.deleteProduct = function(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id != id);
            localStorage.setItem('falconProducts', JSON.stringify(products));
            renderProducts();
            alert('Product deleted successfully!');
        }
    };

    // Update dashboard stats
    function updateStats() {
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalOrders').textContent = '0';
        document.getElementById('totalRevenue').textContent = '₹0';
        document.getElementById('totalCustomers').textContent = '0';
    }

    // Banner Management
    const bannerForm = document.getElementById('bannerForm');
    const bannerImageInput = document.getElementById('bannerImage');
    const bannerImagePreview = document.getElementById('bannerImagePreview');
    const bannerUploadArea = document.querySelector('#bannersSection .image-upload');

    bannerUploadArea.addEventListener('click', () => bannerImageInput.click());
    
    bannerImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                bannerImagePreview.src = e.target.result;
                bannerImagePreview.classList.add('show');
            };
            reader.readAsDataURL(file);
        }
    });

    bannerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const banner = {
            id: Date.now(),
            title: document.getElementById('bannerTitle').value,
            subtitle: document.getElementById('bannerSubtitle').value,
            image: bannerImagePreview.src || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=800&fit=crop'
        };

        banners.push(banner);
        localStorage.setItem('falconBanners', JSON.stringify(banners));
        
        bannerForm.reset();
        bannerImagePreview.classList.remove('show');
        
        renderBanners();
        alert('Banner added successfully!');
    });

    function renderBanners() {
        const tbody = document.getElementById('bannersTableBody');
        tbody.innerHTML = banners.map(banner => `
            <tr>
                <td><img src="${banner.image}" alt="${banner.title}" style="width: 100px; height: 60px; object-fit: cover;"></td>
                <td>${banner.title}</td>
                <td>${banner.subtitle}</td>
                <td>
                    <button class="btn-delete" onclick="deleteBanner(${banner.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    window.deleteBanner = function(id) {
        if (confirm('Are you sure you want to delete this banner?')) {
            banners = banners.filter(b => b.id != id);
            localStorage.setItem('falconBanners', JSON.stringify(banners));
            renderBanners();
            alert('Banner deleted successfully!');
        }
    };

    // Initial render
    renderProducts();
    renderBanners();
}
