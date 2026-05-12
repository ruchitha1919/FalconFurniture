// ============================================
// FALCON FURNITURE - API CONFIGURATION
// ============================================

// API Base URL - Change for production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://your-backend-url.com/api'; // Replace with your production backend URL

// API Endpoints
const API_ENDPOINTS = {
    // Authentication
    signup: `${API_BASE_URL}/auth/signup`,
    login: `${API_BASE_URL}/auth/login`,
    getMe: `${API_BASE_URL}/auth/me`,
    updateProfile: `${API_BASE_URL}/auth/profile`,
    changePassword: `${API_BASE_URL}/auth/change-password`,
    
    // Products
    products: `${API_BASE_URL}/products`,
    featuredProducts: `${API_BASE_URL}/products/featured`,
    productById: (id) => `${API_BASE_URL}/products/${id}`,
    productsByCategory: (category) => `${API_BASE_URL}/products/category/${encodeURIComponent(category)}`,
    createProduct: `${API_BASE_URL}/products`,
    updateProduct: (id) => `${API_BASE_URL}/products/${id}`,
    deleteProduct: (id) => `${API_BASE_URL}/products/${id}`,
    toggleFeatured: (id) => `${API_BASE_URL}/products/${id}/featured`,
    
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
    checkWishlist: (productId) => `${API_BASE_URL}/wishlist/check/${productId}`,
    
    // Health Check
    health: `${API_BASE_URL}/health`
};

// Helper function to get auth token
function getAuthToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser?.token || null;
}

// Helper function to make authenticated API requests
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
            // Handle token expiration
            if (response.status === 401 && data.message.includes('token')) {
                // Token expired, logout user
                localStorage.removeItem('currentUser');
                window.location.reload();
            }
            
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Check if backend is available
async function checkBackendHealth() {
    try {
        const response = await fetch(API_ENDPOINTS.health);
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Backend API is connected');
            return true;
        }
    } catch (error) {
        console.warn('⚠️ Backend API is not available. Using fallback mode.');
        return false;
    }
}

// Initialize backend connection check
let isBackendAvailable = false;
checkBackendHealth().then(available => {
    isBackendAvailable = available;
});

// Export for use in other scripts
window.API_BASE_URL = API_BASE_URL;
window.API_ENDPOINTS = API_ENDPOINTS;
window.apiRequest = apiRequest;
window.getAuthToken = getAuthToken;
window.isBackendAvailable = isBackendAvailable;

console.log('🔧 API Configuration loaded');
console.log('📡 API Base URL:', API_BASE_URL);
