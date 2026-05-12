# Backend Integration Guide - Falcon Furniture

Complete guide to integrate the Node.js backend with the existing frontend.

---

## 📋 Table of Contents

1. [Backend Setup](#backend-setup)
2. [Frontend Integration](#frontend-integration)
3. [API Configuration](#api-configuration)
4. [Authentication Flow](#authentication-flow)
5. [Product Management](#product-management)
6. [Cart & Wishlist](#cart--wishlist)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## 🚀 Backend Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string

### Step 3: Setup Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/falcon-furniture
JWT_SECRET=falcon_furniture_super_secret_key_2026
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@falconfurniture.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5500
FRONTEND_URL_PRODUCTION=https://falcon-furniture-sigma.vercel.app
```

### Step 4: Start Backend Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

---

## 🔗 Frontend Integration

### Step 1: Create API Configuration File

Create `api-config.js` in the root directory:

```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
// For production: const API_BASE_URL = 'https://your-backend-url.com/api';

// API Endpoints
const API_ENDPOINTS = {
    // Auth
    signup: `${API_BASE_URL}/auth/signup`,
    login: `${API_BASE_URL}/auth/login`,
    getMe: `${API_BASE_URL}/auth/me`,
    updateProfile: `${API_BASE_URL}/auth/profile`,
    
    // Products
    products: `${API_BASE_URL}/products`,
    featuredProducts: `${API_BASE_URL}/products/featured`,
    productById: (id) => `${API_BASE_URL}/products/${id}`,
    productsByCategory: (category) => `${API_BASE_URL}/products/category/${category}`,
    
    // Cart
    cart: `${API_BASE_URL}/cart`,
    addToCart: `${API_BASE_URL}/cart/add`,
    updateCart: `${API_BASE_URL}/cart/update`,
    removeFromCart: (productId) => `${API_BASE_URL}/cart/remove/${productId}`,
    clearCart: `${API_BASE_URL}/cart/clear`,
    
    // Wishlist
    wishlist: `${API_BASE_URL}/wishlist`,
    addToWishlist: `${API_BASE_URL}/wishlist/add`,
    removeFromWishlist: (productId) => `${API_BASE_URL}/wishlist/remove/${productId}`,
    clearWishlist: `${API_BASE_URL}/wishlist/clear`,
    checkWishlist: (productId) => `${API_BASE_URL}/wishlist/check/${productId}`
};

// Helper function to get auth token
function getAuthToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser?.token || null;
}

// Helper function to make authenticated requests
async function apiRequest(url, options = {}) {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}
```

### Step 2: Update script.js - Replace Authentication System

Replace the localStorage-based authentication with backend API calls:

```javascript
// ============================================
// BACKEND API AUTHENTICATION SYSTEM
// ============================================

// Current logged-in user (now includes token)
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    try {
        const response = await apiRequest(API_ENDPOINTS.signup, {
            method: 'POST',
            body: JSON.stringify({ name, email, phone, password })
        });
        
        if (response.success) {
            // Save user with token
            currentUser = {
                ...response.user,
                token: response.token
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Load user's cart and wishlist from backend
            await loadUserCartFromBackend();
            await loadUserWishlistFromBackend();
            
            // Update UI
            updateUserUIState();
            updateWishlistBadge();
            updateCartBadge();
            
            // Close modal
            document.getElementById('authModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset form
            document.getElementById('signupForm').reset();
            
            alert(`Welcome to Falcon Furniture, ${currentUser.name}!`);
            
            // Re-render products
            if (document.getElementById('productGrid')) {
                renderProducts();
            }
        }
    } catch (error) {
        alert(error.message || 'Signup failed. Please try again.');
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await apiRequest(API_ENDPOINTS.login, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.success) {
            // Save user with token
            currentUser = {
                ...response.user,
                token: response.token
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Load user's cart and wishlist from backend
            await loadUserCartFromBackend();
            await loadUserWishlistFromBackend();
            
            // Update UI
            updateUserUIState();
            updateWishlistBadge();
            updateCartBadge();
            
            // Close modal
            document.getElementById('authModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset form
            document.getElementById('loginForm').reset();
            
            alert(`Welcome back, ${currentUser.name}!`);
            
            // Re-render products
            if (document.getElementById('productGrid')) {
                renderProducts();
            }
        }
    } catch (error) {
        alert(error.message || 'Login failed. Please check your credentials.');
    }
}

// Load Cart from Backend
async function loadUserCartFromBackend() {
    if (!currentUser) return;
    
    try {
        const response = await apiRequest(API_ENDPOINTS.cart);
        if (response.success) {
            cart = response.cart.items.map(item => ({
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image,
                quantity: item.quantity
            }));
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Load Wishlist from Backend
async function loadUserWishlistFromBackend() {
    if (!currentUser) return;
    
    try {
        const response = await apiRequest(API_ENDPOINTS.wishlist);
        if (response.success) {
            wishlist = response.wishlist.items.map(item => ({
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image
            }));
        }
    } catch (error) {
        console.error('Error loading wishlist:', error);
    }
}

// Add to Cart (Backend)
async function addToCart(productId, quantity = 1) {
    if (!currentUser) {
        alert('Please login to add items to your cart.');
        showAuthModal('login');
        return;
    }
    
    try {
        const product = products.find(p => p.id === productId);
        
        const response = await apiRequest(API_ENDPOINTS.addToCart, {
            method: 'POST',
            body: JSON.stringify({ 
                productId, 
                quantity 
            })
        });
        
        if (response.success) {
            await loadUserCartFromBackend();
            updateCartBadge();
            alert('Product added to cart!');
        }
    } catch (error) {
        alert(error.message || 'Failed to add to cart');
    }
}

// Toggle Wishlist (Backend)
async function toggleWishlist(event, productId) {
    event.stopPropagation();
    
    if (!currentUser) {
        alert('Please login to add items to your wishlist.');
        showAuthModal('login');
        return;
    }
    
    try {
        const isInWishlist = wishlist.some(item => item.id === productId);
        
        if (isInWishlist) {
            // Remove from wishlist
            const response = await apiRequest(
                API_ENDPOINTS.removeFromWishlist(productId),
                { method: 'DELETE' }
            );
            
            if (response.success) {
                await loadUserWishlistFromBackend();
                updateWishlistBadge();
                renderProducts();
            }
        } else {
            // Add to wishlist
            const response = await apiRequest(API_ENDPOINTS.addToWishlist, {
                method: 'POST',
                body: JSON.stringify({ productId })
            });
            
            if (response.success) {
                await loadUserWishlistFromBackend();
                updateWishlistBadge();
                renderProducts();
                
                // Visual feedback
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
    } catch (error) {
        alert(error.message || 'Failed to update wishlist');
    }
}

// Load Products from Backend
async function loadProductsFromBackend() {
    try {
        const response = await apiRequest(API_ENDPOINTS.products);
        
        if (response.success) {
            products = response.products.map(product => ({
                id: product._id,
                name: product.name,
                price: product.price.toString(),
                image: product.image,
                category: product.category,
                badge: product.badge,
                description: product.description,
                stock: product.stock
            }));
            
            renderProducts();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to default products
        products = getDefaultProducts();
        renderProducts();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthUI();
    setupAuthEventListeners();
    
    // Load products from backend
    if (document.getElementById('productGrid')) {
        loadProductsFromBackend();
    }
    
    // Load user data if logged in
    if (currentUser) {
        loadUserCartFromBackend();
        loadUserWishlistFromBackend();
    }
});
```

### Step 3: Update index.html - Add API Config Script

Add before `script.js`:

```html
<!-- API Configuration -->
<script src="api-config.js"></script>

<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
<script src="firebase-config.js"></script>
<script src="script.js"></script>
```

---

## 🔐 Admin Integration

### Update admin.js for Backend API

```javascript
// Admin Login with Backend
async function adminLogin(email, password) {
    try {
        const response = await apiRequest(API_ENDPOINTS.login, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.success && response.user.role === 'admin') {
            localStorage.setItem('adminUser', JSON.stringify({
                ...response.user,
                token: response.token
            }));
            
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Admin access required');
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// Create Product with Backend
async function createProduct(productData) {
    try {
        const response = await apiRequest(API_ENDPOINTS.products, {
            method: 'POST',
            body: JSON.stringify(productData)
        });
        
        if (response.success) {
            alert('Product created successfully!');
            loadProducts(); // Refresh product list
        }
    } catch (error) {
        alert('Failed to create product: ' + error.message);
    }
}
```

---

## 🧪 Testing

### Test Backend API

1. **Start Backend:**
```bash
cd backend
npm run dev
```

2. **Test Health Check:**
```bash
curl http://localhost:5000/api/health
```

3. **Test Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","phone":"9876543210","password":"test123"}'
```

4. **Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Test Frontend Integration

1. Open `index.html` in browser
2. Open DevTools Console
3. Try signup/login
4. Check Network tab for API calls
5. Verify data in MongoDB Atlas

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Push backend to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)

1. Update `api-config.js` with production API URL
2. Push to GitHub
3. Vercel auto-deploys

### Update CORS

In `backend/src/server.js`, add production frontend URL:

```javascript
const corsOptions = {
    origin: [
        'http://localhost:5500',
        'https://falcon-furniture-sigma.vercel.app'
    ],
    credentials: true
};
```

---

## ✅ Integration Checklist

- [ ] Backend server running
- [ ] MongoDB Atlas connected
- [ ] Admin user created
- [ ] `api-config.js` created
- [ ] Frontend updated with API calls
- [ ] Signup/Login working
- [ ] Products loading from backend
- [ ] Cart syncing with backend
- [ ] Wishlist syncing with backend
- [ ] Admin panel connected
- [ ] CORS configured
- [ ] Environment variables set
- [ ] Testing complete
- [ ] Ready for deployment

---

## 📞 Support

**Backend Issues:**
- Check server logs
- Verify MongoDB connection
- Check environment variables

**Frontend Issues:**
- Check browser console
- Verify API URLs
- Check network tab

**Authentication Issues:**
- Verify JWT token
- Check token expiration
- Verify user credentials

---

**Status:** ✅ Ready for Integration  
**Version:** 1.0.0  
**Last Updated:** May 12, 2026
