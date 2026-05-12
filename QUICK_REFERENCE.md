# 🚀 Quick Reference - Falcon Furniture Backend

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Start server
npm run dev

# 4. Test
curl http://localhost:5000/api/health
```

---

## 📡 API Endpoints Cheat Sheet

### Auth
```
POST   /api/auth/signup          Register
POST   /api/auth/login           Login
GET    /api/auth/me              Get profile (🔒)
```

### Products
```
GET    /api/products             All products
GET    /api/products/featured    Featured
GET    /api/products/:id         Single product
POST   /api/products             Create (🔒 Admin)
PUT    /api/products/:id         Update (🔒 Admin)
DELETE /api/products/:id         Delete (🔒 Admin)
```

### Cart
```
GET    /api/cart                 Get cart (🔒)
POST   /api/cart/add             Add item (🔒)
PUT    /api/cart/update          Update (🔒)
DELETE /api/cart/remove/:id      Remove (🔒)
```

### Wishlist
```
GET    /api/wishlist             Get wishlist (🔒)
POST   /api/wishlist/add         Add item (🔒)
DELETE /api/wishlist/remove/:id  Remove (🔒)
```

🔒 = Requires `Authorization: Bearer <token>`

---

## 🔑 Default Admin Credentials

```
Email: admin@falconfurniture.com
Password: admin123
```

⚠️ Change in production!

---

## 🧪 Quick Test Commands

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"9876543210","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

---

## 🗄️ MongoDB Atlas Setup (3 Minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 Free)
4. Create database user
5. Whitelist IP: 0.0.0.0/0
6. Get connection string
7. Paste in `.env` as `MONGODB_URI`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/         Database connection
│   ├── controllers/    Business logic
│   ├── middleware/     Auth & errors
│   ├── models/         Database schemas
│   ├── routes/         API routes
│   ├── utils/          Helper functions
│   └── server.js       Main server
├── .env                Environment variables
└── package.json        Dependencies
```

---

## 🔧 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@falconfurniture.com
ADMIN_PASSWORD=admin123
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check port
netstat -ano | findstr :5000

# Reinstall
rm -rf node_modules
npm install
```

### MongoDB connection error
- Check URI in `.env`
- Verify password
- Check IP whitelist

### CORS error
- Add frontend URL to `.env`
- Restart server

---

## 📚 Documentation Files

- `backend/README.md` - Complete API docs
- `BACKEND_INTEGRATION_GUIDE.md` - Frontend integration
- `BACKEND_SETUP_COMPLETE.md` - Setup guide
- `BACKEND_IMPLEMENTATION_SUMMARY.md` - Full summary
- `QUICK_REFERENCE.md` - This file

---

## 🚀 Deployment

### Railway (Recommended)
1. Push to GitHub
2. Connect Railway
3. Add environment variables
4. Deploy

### Update Frontend
```javascript
// api-config.js
const API_BASE_URL = 'https://your-backend.railway.app/api';
```

---

## ✅ Success Checklist

- [ ] Backend server running
- [ ] MongoDB connected
- [ ] Admin user created
- [ ] API health check working
- [ ] Signup/Login tested
- [ ] Products loading
- [ ] Cart working
- [ ] Wishlist working

---

## 📞 Quick Help

**Issue:** Can't connect to MongoDB  
**Fix:** Check connection string in `.env`

**Issue:** Token expired  
**Fix:** Login again to get new token

**Issue:** CORS error  
**Fix:** Add frontend URL to CORS config

---

**Version:** 1.0.0  
**Status:** ✅ Ready  
**Support:** Check full documentation files
