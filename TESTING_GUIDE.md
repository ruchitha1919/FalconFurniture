# Testing Guide - Falcon Furniture Admin Dashboard

## 🚀 Your Website is Live!

**Live URL**: https://falcon-furniture-sigma.vercel.app/

## ✅ What's Been Configured

1. ✅ Firebase Authentication
2. ✅ Firebase Realtime Database
3. ✅ Cloudinary Image Uploads
4. ✅ Admin Dashboard

## 🧪 Testing Steps

### Step 1: Test Admin Login

1. Go to: https://falcon-furniture-sigma.vercel.app/admin-login.html
2. Login with:
   - **Email**: `admin@falconfurniture.com`
   - **Password**: `admin123`
3. You should be redirected to the admin dashboard

**Expected Result**: Successfully logged in and see the dashboard

---

### Step 2: Test Product Upload with Cloudinary

1. In the admin dashboard, you should see **"Products Management"** section
2. Fill in the product form:
   - **Product Name**: Test Sofa
   - **Price**: 25000
   - **Category**: Living Room
   - **Description**: Beautiful test sofa
   - **Stock**: 10
   - **Image**: Click to upload an image file

3. Click **"Add Product"** button

**Expected Result**:
- Button shows "Uploading image..." (while uploading to Cloudinary)
- Button shows "Saving product..." (while saving to Firebase)
- Success message: "Product saved successfully!"
- Product appears in the products table below

---

### Step 3: Verify Image in Cloudinary

1. Go to your Cloudinary dashboard: https://console.cloudinary.com/
2. Click **Media Library** in the left sidebar
3. Look for folder: **falcon-furniture/products/**
4. You should see your uploaded image

**Expected Result**: Image is stored in Cloudinary with URL like:
`https://res.cloudinary.com/drykxz5sw/image/upload/v1234567890/falcon-furniture/products/filename.jpg`

---

### Step 4: Verify Data in Firebase

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **Falcon Furniture**
3. Go to **Realtime Database** in the left sidebar
4. You should see a **"products"** node with your test product
5. Check that the **"image"** field contains the Cloudinary URL

**Expected Result**: Product data stored in Firebase with Cloudinary image URL

---

### Step 5: Test Product Display on Website

1. Go to homepage: https://falcon-furniture-sigma.vercel.app/
2. Scroll down to **"Featured Products"** section
3. Your test product should appear in the grid

**Expected Result**: Product displays with:
- Cloudinary image
- Product name
- Price

---

### Step 6: Test Banner Upload

1. In admin dashboard, click **"Banners"** in the sidebar
2. Fill in the banner form:
   - **Banner Title**: Summer Sale
   - **Banner Subtitle**: Up to 50% Off
   - **Banner Image**: Upload an image (1600x800px recommended)
3. Click **"Add Banner"**

**Expected Result**:
- Image uploads to Cloudinary (folder: falcon-furniture/banners/)
- Banner saved to Firebase
- Banner appears in the banners table

---

### Step 7: Test Edit Product

1. In the products table, click **"Edit"** button on your test product
2. Form should populate with existing data
3. Change the price to: 30000
4. Click **"Add Product"** (it will update)

**Expected Result**: Product price updated in Firebase and on website

---

### Step 8: Test Delete Product

1. In the products table, click **"Delete"** button
2. Confirm the deletion
3. Product should be removed from the table

**Expected Result**: Product deleted from Firebase and no longer shows on website

---

## 🐛 Troubleshooting

### Issue: "Firebase is not defined"
**Solution**: 
- Check browser console for errors
- Verify Firebase scripts are loaded in HTML
- Check firebase-config.js has correct credentials

### Issue: "Cloudinary upload failed"
**Solution**:
- Verify upload preset is set to **"Unsigned"** in Cloudinary settings
- Check cloud name is correct: `drykxz5sw`
- Check upload preset name: `falcon_furniture_unsigned`
- Check browser console for detailed error

### Issue: "Permission denied" in Firebase
**Solution**:
- Go to Firebase Console → Realtime Database → Rules
- Verify rules allow authenticated writes:
```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

### Issue: "Invalid email or password"
**Solution**:
- Go to Firebase Console → Authentication → Users
- Verify admin user exists: `admin@falconfurniture.com`
- If not, add the user manually

### Issue: Images not showing on website
**Solution**:
- Check if image URL in Firebase is a valid Cloudinary URL
- Verify Cloudinary images are publicly accessible
- Check browser console for CORS errors

---

## 📊 What to Check

### In Firebase Console:
- ✅ Authentication → Users → admin user exists
- ✅ Realtime Database → products node → product data
- ✅ Realtime Database → banners node → banner data

### In Cloudinary Console:
- ✅ Media Library → falcon-furniture/products → images
- ✅ Media Library → falcon-furniture/banners → images

### On Live Website:
- ✅ Homepage shows products with Cloudinary images
- ✅ Product details page works
- ✅ Cart functionality works
- ✅ Admin login works
- ✅ Admin dashboard loads

---

## 🎯 Next Steps After Testing

Once everything works:

1. **Add Real Products**:
   - Add your actual furniture products
   - Use high-quality images
   - Set accurate prices and descriptions

2. **Add Hero Banners**:
   - Create promotional banners
   - Use 1600x800px images for best quality

3. **Customize Content**:
   - Update About section
   - Update Process section
   - Add company information

4. **Security** (Important for Production):
   - Change admin password from `admin123` to something secure
   - Update Firebase rules to restrict write access to admin email only
   - Consider adding more admin users if needed

5. **SEO & Marketing**:
   - Add meta descriptions
   - Add Open Graph tags
   - Set up Google Analytics
   - Submit to Google Search Console

---

## 📞 Support

If you encounter any issues during testing:
1. Check browser console (F12) for errors
2. Check Firebase Console for data
3. Check Cloudinary Console for images
4. Review the error messages carefully

---

## ✨ Summary

Your Falcon Furniture website now has:
- ✅ Firebase Authentication (secure admin login)
- ✅ Firebase Realtime Database (product/banner storage)
- ✅ Cloudinary Integration (image hosting & CDN)
- ✅ Admin Dashboard (product/banner management)
- ✅ Shopping Cart (customer functionality)
- ✅ Responsive Design (mobile, tablet, desktop)

**Everything is ready for testing!** 🎉

Start with Step 1 and work through each test to verify everything works correctly.
