# Falcon Furniture Backend API

Complete Node.js + Express backend with MongoDB Atlas integration for the Falcon Furniture e-commerce website.

## 🚀 Features

- ✅ User Authentication (Signup/Login with JWT)
- ✅ Secure Password Hashing (bcrypt)
- ✅ Product Management (CRUD operations)
- ✅ Admin Panel Integration
- ✅ User-specific Cart (MongoDB)
- ✅ User-specific Wishlist (MongoDB)
- ✅ MongoDB Atlas Integration
- ✅ Environment Variables (dotenv)
- ✅ Error Handling Middleware
- ✅ CORS Configuration
- ✅ Input Validation
- ✅ RESTful API Design

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product CRUD
│   │   ├── cartController.js    # Cart management
│   │   └── wishlistController.js # Wishlist management
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Cart.js              # Cart schema
│   │   └── Wishlist.js          # Wishlist schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   ├── cartRoutes.js        # Cart endpoints
│   │   └── wishlistRoutes.js    # Wishlist endpoints
│   ├── utils/
│   │   └── seedAdmin.js         # Admin user seeder
│   └── server.js                # Main server file
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Installation & Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/falcon-furniture?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Admin Configuration
ADMIN_EMAIL=admin@falconfurniture.com
ADMIN_PASSWORD=admin123

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
FRONTEND_URL_PRODUCTION=https://falcon-furniture-sigma.vercel.app
```

### Step 3: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `falcon-furniture`
8. Paste in `.env` as `MONGODB_URI`

### Step 4: Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start at: `http://localhost:5000`

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. User Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user"
  }
}
```

#### 2. User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 4. Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9999999999"
}
```

#### 5. Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

### Product Endpoints

#### 1. Get All Products
```http
GET /api/products
GET /api/products?category=Living Room
GET /api/products?featured=true
GET /api/products?search=sofa
GET /api/products?sort=price-asc
GET /api/products?page=1&limit=20
```

#### 2. Get Single Product
```http
GET /api/products/:id
```

#### 3. Get Featured Products
```http
GET /api/products/featured?limit=8
```

#### 4. Get Products by Category
```http
GET /api/products/category/Living Room
```

#### 5. Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Modern L-Shape Sofa",
  "description": "Comfortable and stylish sofa",
  "price": 45999,
  "originalPrice": 59999,
  "category": "Living Room",
  "image": "https://cloudinary.com/...",
  "stock": 10,
  "badge": "New",
  "isFeatured": true
}
```

#### 6. Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 49999
}
```

#### 7. Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <admin_token>
```

#### 8. Toggle Featured Status (Admin Only)
```http
PATCH /api/products/:id/featured
Authorization: Bearer <admin_token>
```

---

### Cart Endpoints

#### 1. Get User's Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### 2. Add Item to Cart
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "64abc123...",
  "quantity": 2
}
```

#### 3. Update Cart Item Quantity
```http
PUT /api/cart/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "64abc123...",
  "quantity": 3
}
```

#### 4. Remove Item from Cart
```http
DELETE /api/cart/remove/:productId
Authorization: Bearer <token>
```

#### 5. Clear Cart
```http
DELETE /api/cart/clear
Authorization: Bearer <token>
```

---

### Wishlist Endpoints

#### 1. Get User's Wishlist
```http
GET /api/wishlist
Authorization: Bearer <token>
```

#### 2. Add Item to Wishlist
```http
POST /api/wishlist/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "64abc123..."
}
```

#### 3. Remove Item from Wishlist
```http
DELETE /api/wishlist/remove/:productId
Authorization: Bearer <token>
```

#### 4. Clear Wishlist
```http
DELETE /api/wishlist/clear
Authorization: Bearer <token>
```

#### 5. Check if Product in Wishlist
```http
GET /api/wishlist/check/:productId
Authorization: Bearer <token>
```

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### How to Use:

1. **Signup/Login** to get a token
2. **Include token** in Authorization header for protected routes:
   ```
   Authorization: Bearer <your_token_here>
   ```

### Token Expiration:
- Default: 7 days
- Configurable in `.env` with `JWT_EXPIRE`

---

## 👤 Admin Access

### Default Admin Credentials:
```
Email: admin@falconfurniture.com
Password: admin123
```

**⚠️ IMPORTANT:** Change these credentials in production!

### Admin Capabilities:
- Create products
- Update products
- Delete products
- Toggle featured status
- Full access to all endpoints

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String (user/admin),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  category: String,
  image: String,
  images: [String],
  stock: Number,
  badge: String,
  isFeatured: Boolean,
  isActive: Boolean,
  rating: Number,
  numReviews: Number,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model
```javascript
{
  user: ObjectId (User),
  items: [{
    product: ObjectId (Product),
    quantity: Number,
    price: Number,
    addedAt: Date
  }],
  totalItems: Number,
  totalPrice: Number,
  updatedAt: Date
}
```

### Wishlist Model
```javascript
{
  user: ObjectId (User),
  items: [{
    product: ObjectId (Product),
    addedAt: Date
  }],
  updatedAt: Date
}
```

---

## 🧪 Testing the API

### Using cURL:

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"9876543210","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

### Using Postman:

1. Import the API endpoints
2. Set Authorization header: `Bearer <token>`
3. Test all endpoints

---

## 🚀 Deployment

### Deploy to Heroku:

1. Create Heroku app:
```bash
heroku create falcon-furniture-api
```

2. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
```

3. Deploy:
```bash
git push heroku main
```

### Deploy to Railway/Render:

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

---

## 🔧 Troubleshooting

### MongoDB Connection Error
- Check MongoDB URI in `.env`
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify database user credentials

### JWT Token Error
- Check if `JWT_SECRET` is set in `.env`
- Verify token format: `Bearer <token>`
- Check token expiration

### CORS Error
- Add frontend URL to `FRONTEND_URL` in `.env`
- Check CORS configuration in `server.js`

---

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Server port | No | 5000 |
| NODE_ENV | Environment | No | development |
| MONGODB_URI | MongoDB connection string | Yes | - |
| JWT_SECRET | JWT secret key | Yes | - |
| JWT_EXPIRE | Token expiration | No | 7d |
| ADMIN_EMAIL | Admin email | No | admin@falconfurniture.com |
| ADMIN_PASSWORD | Admin password | No | admin123 |
| FRONTEND_URL | Frontend URL (dev) | No | http://localhost:3000 |
| FRONTEND_URL_PRODUCTION | Frontend URL (prod) | No | - |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📄 License

ISC License

---

## 📞 Support

For issues or questions:
- Check this README
- Review API documentation
- Check server logs
- Test with Postman

---

**Version:** 1.0.0  
**Last Updated:** May 12, 2026  
**Status:** ✅ Production Ready
