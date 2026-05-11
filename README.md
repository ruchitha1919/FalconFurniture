# Falcon Furniture & Interiors Website

## Essential Files Structure

### Main Website (Customer-Facing)
- **index.html** - Main homepage with header, hero carousel, categories, and products
- **styles.css** - All styles for the main website
- **script.js** - JavaScript for interactive features (carousel, search, cart)
- **cart.html** - Shopping cart page with product management

### Product Details Page
- **product-details.html** - Individual product page with gallery, zoom, and related products
- **product-details.css** - Styles for product details page
- **product-details.js** - JavaScript for product page interactions (zoom, color selection, cart)

### Admin Dashboard
- **admin-login.html** - Admin authentication page with Firebase integration
- **admin-dashboard.html** - Admin panel for managing products and banners
- **admin.css** - Styles for admin interface
- **admin.js** - JavaScript for admin functionality with Firebase/localStorage
- **firebase-config.js** - Firebase configuration file

### Data
- **data/products.js** - Product data structure

## How to Run

### Option 1: Local Development
1. Start the server:
   ```bash
   python -m http.server 8000
   ```

2. Access the website:
   - **Homepage**: http://localhost:8000/index.html
   - **Product Details**: http://localhost:8000/product-details.html
   - **Shopping Cart**: http://localhost:8000/cart.html
   - **Admin Login**: http://localhost:8000/admin-login.html
   - **Admin Dashboard**: http://localhost:8000/admin-dashboard.html

### Option 2: Live Deployment
- **Live Site**: https://falcon-furniture-sigma.vercel.app/
- **GitHub Repo**: https://github.com/ruchitha1919/FalconFurniture

## Firebase Setup (Required for Admin Dashboard)

The admin dashboard supports both Firebase (recommended) and localStorage (fallback). To enable Firebase:

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name (e.g., "falcon-furniture")
4. Follow the setup wizard

### Step 2: Enable Firebase Services

#### A. Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Users** tab → **Add user**
4. Add admin user:
   - Email: `admin@falconfurniture.com`
   - Password: `admin123` (or your secure password)

#### B. Enable Realtime Database
1. Go to **Realtime Database** → **Create Database**
2. Choose location (e.g., us-central1)
3. Start in **test mode** (for development)
4. Update rules for security:
```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null"
    },
    "banners": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

#### C. Enable Storage
1. Go to **Storage** → **Get Started**
2. Start in **test mode** (for development)
3. Update rules for security:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /banners/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 3: Get Firebase Configuration
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web** icon (</>) to add web app
4. Register app with nickname (e.g., "Falcon Furniture Web")
5. Copy the configuration object

### Step 4: Update firebase-config.js
Open `firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com"
};
```

### Step 5: Test Firebase Integration
1. Open admin login page
2. Login with: `admin@falconfurniture.com` / `admin123`
3. Add a test product in the dashboard
4. Check Firebase Console → Realtime Database to see the data
5. Upload an image to verify Storage is working

### Troubleshooting
- **Firebase not defined**: Check if Firebase SDK scripts are loaded in HTML
- **Permission denied**: Verify database/storage rules are set correctly
- **Auth error**: Ensure admin user is created in Firebase Authentication
- **CORS error**: Check Firebase Storage CORS configuration

## Admin Credentials
- **Email**: admin@falconfurniture.com
- **Password**: admin123

**Note**: Without Firebase setup, the admin dashboard will use localStorage as fallback (data won't persist across deployments).

## Features Included

### Customer Features
✅ Dynamic search with auto-changing placeholders
✅ Hero carousel with 3 slides
✅ About section with company info and 6+ years experience
✅ Process section with 4-step workflow
✅ Category cards (Living Room, Bedroom, Office)
✅ Product grid with 8 featured items
✅ Wishlist modal with user form
✅ Shopping cart with quantity management
✅ Sticky navbar on all pages
✅ Responsive design (mobile, tablet, desktop)

### Product Details
✅ Image gallery with clickable thumbnails
✅ Square lens magnifier zoom (200x200px, 3x zoom)
✅ Clickable color options (Brown, Gray, Navy, Beige)
✅ Working quantity +/- buttons (min 1, max 10)
✅ Add to Cart functionality
✅ Dynamic cart badge updates
✅ Product information and pricing
✅ Related products section

### Shopping Cart
✅ Empty state: "No items added to cart" message
✅ Product cards with image, name, color, quantity, price
✅ Quantity controls (+/-)
✅ Remove item functionality
✅ Order summary with total calculation
✅ Cart data persists in localStorage

### Admin Features
✅ Secure login with Firebase Authentication
✅ Email/password validation
✅ Session management
✅ Dashboard with statistics cards
✅ Product management (add/edit/delete)
✅ Product form with image upload and preview
✅ Banner management (add/delete)
✅ Firebase Realtime Database integration
✅ Firebase Storage for images
✅ localStorage fallback when Firebase unavailable
✅ Responsive admin interface
✅ Premium brown theme (#8B5E3C)

## Color Scheme
- Primary Brown: #8B5E3C
- Secondary Brown: #A0522D
- Accent colors for badges and buttons

## Technologies Used
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Firebase (Authentication, Realtime Database, Storage)
- Font Awesome Icons
- Unsplash Images (placeholder)

## Data Storage
- **Cart Data**: localStorage with key `falconCart`
- **Products**: Firebase Realtime Database or localStorage (`falconProducts`)
- **Banners**: Firebase Realtime Database or localStorage (`falconBanners`)
- **Admin Session**: localStorage (`adminLoggedIn`, `adminEmail`, `adminUid`)

## Deployment
- **Platform**: Vercel
- **Auto-deploy**: Enabled on GitHub push
- **Live URL**: https://falcon-furniture-sigma.vercel.app/

## Project Structure
```
falcon-furniture/
├── index.html              # Homepage
├── styles.css              # Main styles
├── script.js               # Main JavaScript
├── cart.html               # Shopping cart page
├── product-details.html    # Product details page
├── product-details.css     # Product details styles
├── product-details.js      # Product details JavaScript
├── admin-login.html        # Admin login page
├── admin-dashboard.html    # Admin dashboard
├── admin.css               # Admin styles
├── admin.js                # Admin JavaScript
├── firebase-config.js      # Firebase configuration
├── data/
│   └── products.js         # Product data structure
├── assets/
│   ├── icons/              # Icon assets
│   └── images/             # Image assets
└── README.md               # Documentation
```

## Next Steps
1. ✅ Set up Firebase project and add credentials to `firebase-config.js`
2. ✅ Create admin user in Firebase Authentication
3. ✅ Configure Firebase Realtime Database rules
4. ✅ Configure Firebase Storage rules
5. Test admin dashboard with Firebase integration
6. Add real product images and data
7. Implement order management system
8. Add customer management features
9. Implement analytics and reporting
