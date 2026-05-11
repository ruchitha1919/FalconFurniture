// Firebase or localStorage fallback
const USE_FIREBASE = typeof firebase !== 'undefined';

// Log Firebase status
console.log('Firebase available:', USE_FIREBASE);
if (USE_FIREBASE) {
    console.log('Firebase Auth:', typeof firebaseAuth !== 'undefined');
    console.log('Firebase Database:', typeof firebaseDatabase !== 'undefined');
}

// Admin credentials for email/password login
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

        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }

        if (USE_FIREBASE) {
            // Firebase Authentication
            console.log('Attempting Firebase login...');
            firebaseAuth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    console.log('Firebase login successful:', userCredential.user.email);
                    localStorage.setItem('adminLoggedIn', 'true');
                    localStorage.setItem('adminEmail', email);
                    localStorage.setItem('adminUid', userCredential.user.uid);
                    window.location.href = 'admin-dashboard.html';
                })
                .catch((error) => {
                    console.error('Firebase login error:', error.code, error.message);
                    showError('Invalid email or password');
                });
        } else {
            console.log('Firebase not available, using local authentication');
            // Fallback to local authentication
            if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminEmail', email);
                window.location.href = 'admin-dashboard.html';
            } else {
                showError('Invalid email or password');
            }
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

    const adminEmail = localStorage.getItem('adminEmail');
    document.getElementById('adminEmail').textContent = adminEmail;
    document.getElementById('adminInitial').textContent = adminEmail.charAt(0).toUpperCase();

    let products = [];
    let banners = [];

    // Firebase Database References
    const productsRef = USE_FIREBASE ? firebaseDatabase.ref('products') : null;
    const bannersRef = USE_FIREBASE ? firebaseDatabase.ref('banners') : null;

    // Load data from Firebase or localStorage
    function loadData() {
        if (USE_FIREBASE) {
            // Load from Firebase
            productsRef.on('value', (snapshot) => {
                products = [];
                snapshot.forEach((childSnapshot) => {
                    products.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                renderProducts();
            });

            bannersRef.on('value', (snapshot) => {
                banners = [];
                snapshot.forEach((childSnapshot) => {
                    banners.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                renderBanners();
            });
        } else {
            // Load from localStorage
            products = JSON.parse(localStorage.getItem('falconProducts')) || [];
            banners = JSON.parse(localStorage.getItem('falconBanners')) || [];
            renderProducts();
            renderBanners();
        }
    }

    // Menu navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.dataset.section;
            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            contentSections.forEach(s => s.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            if (USE_FIREBASE) {
                firebaseAuth.signOut();
            }
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminEmail');
            localStorage.removeItem('adminUid');
            window.location.href = 'admin-login.html';
        }
    });

    // Product Management
    const productForm = document.getElementById('productForm');
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const imageUploadArea = document.querySelector('.image-upload');

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
    productForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('productId').value;
        const productData = {
            name: document.getElementById('productName').value,
            price: document.getElementById('productPrice').value,
            category: document.getElementById('productCategory').value,
            description: document.getElementById('productDescription').value,
            stock: document.getElementById('productStock').value,
            image: imagePreview.src || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
            createdAt: Date.now()
        };

        try {
            // Upload to Cloudinary if new image file selected
            if (imageInput.files[0]) {
                const file = imageInput.files[0];
                
                // Show uploading message
                const submitBtn = productForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Uploading image...';
                submitBtn.disabled = true;

                try {
                    // Upload to Cloudinary
                    const cloudinaryUrl = await uploadToCloudinary(file, 'products');
                    productData.image = cloudinaryUrl;
                    
                    submitBtn.textContent = 'Saving product...';
                } catch (uploadError) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    alert('Failed to upload image. Please try again.');
                    console.error('Image upload error:', uploadError);
                    return;
                }
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }

            if (USE_FIREBASE) {
                // Save to Firebase Database
                if (productId) {
                    await productsRef.child(productId).update(productData);
                } else {
                    await productsRef.push(productData);
                }
            } else {
                // Save to localStorage
                if (productId) {
                    const index = products.findIndex(p => p.id == productId);
                    products[index] = { id: productId, ...productData };
                } else {
                    products.push({ id: Date.now().toString(), ...productData });
                }
                localStorage.setItem('falconProducts', JSON.stringify(products));
                renderProducts();
            }

            productForm.reset();
            imagePreview.classList.remove('show');
            document.getElementById('productId').value = '';
            alert('Product saved successfully!');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product. Please try again.');
        }
    });

    // Render products table
    function renderProducts() {
        const tbody = document.getElementById('productsTableBody');
        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                        No products added yet
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = products.map(product => `
                <tr>
                    <td><img src="${product.image}" alt="${product.name}"></td>
                    <td>${product.name}</td>
                    <td>₹${product.price}</td>
                    <td>${product.category}</td>
                    <td>${product.stock}</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-edit" onclick="editProduct('${product.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" onclick="deleteProduct('${product.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
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
            productForm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Delete product
    window.deleteProduct = async function(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                if (USE_FIREBASE) {
                    await productsRef.child(id).remove();
                } else {
                    products = products.filter(p => p.id != id);
                    localStorage.setItem('falconProducts', JSON.stringify(products));
                    renderProducts();
                }
                alert('Product deleted successfully!');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product. Please try again.');
            }
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

    bannerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const bannerData = {
            title: document.getElementById('bannerTitle').value,
            subtitle: document.getElementById('bannerSubtitle').value,
            image: bannerImagePreview.src || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=800&fit=crop',
            createdAt: Date.now()
        };

        try {
            // Upload to Cloudinary if new image file selected
            if (bannerImageInput.files[0]) {
                const file = bannerImageInput.files[0];
                
                // Show uploading message
                const submitBtn = bannerForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Uploading image...';
                submitBtn.disabled = true;

                try {
                    // Upload to Cloudinary
                    const cloudinaryUrl = await uploadToCloudinary(file, 'banners');
                    bannerData.image = cloudinaryUrl;
                    
                    submitBtn.textContent = 'Saving banner...';
                } catch (uploadError) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    alert('Failed to upload image. Please try again.');
                    console.error('Image upload error:', uploadError);
                    return;
                }
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }

            if (USE_FIREBASE) {
                await bannersRef.push(bannerData);
            } else {
                banners.push({ id: Date.now().toString(), ...bannerData });
                localStorage.setItem('falconBanners', JSON.stringify(banners));
                renderBanners();
            }

            bannerForm.reset();
            bannerImagePreview.classList.remove('show');
            alert('Banner added successfully!');
        } catch (error) {
            console.error('Error saving banner:', error);
            alert('Error saving banner. Please try again.');
        }
    });

    function renderBanners() {
        const tbody = document.getElementById('bannersTableBody');
        if (banners.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 40px; color: #999;">
                        No banners added yet
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = banners.map(banner => `
                <tr>
                    <td><img src="${banner.image}" alt="${banner.title}" style="width: 100px; height: 60px; object-fit: cover;"></td>
                    <td>${banner.title}</td>
                    <td>${banner.subtitle}</td>
                    <td>
                        <button class="btn-delete" onclick="deleteBanner('${banner.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    window.deleteBanner = async function(id) {
        if (confirm('Are you sure you want to delete this banner?')) {
            try {
                if (USE_FIREBASE) {
                    await bannersRef.child(id).remove();
                } else {
                    banners = banners.filter(b => b.id != id);
                    localStorage.setItem('falconBanners', JSON.stringify(banners));
                    renderBanners();
                }
                alert('Banner deleted successfully!');
            } catch (error) {
                console.error('Error deleting banner:', error);
                alert('Error deleting banner. Please try again.');
            }
        }
    };

    // Initial load
    loadData();
}
