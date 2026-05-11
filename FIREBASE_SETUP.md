# Firebase Setup Guide for Falcon Furniture

This guide will help you set up Firebase for the Falcon Furniture admin dashboard.

## Why Firebase?

Firebase provides:
- **Authentication**: Secure admin login
- **Realtime Database**: Store products and banners with real-time sync
- **Storage**: Upload and store product/banner images
- **Free Tier**: Generous free tier for small to medium projects

## Prerequisites

- Google account
- Admin access to the project

## Step-by-Step Setup

### 1. Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** (or select existing project)
3. Enter project name: `falcon-furniture` (or your preferred name)
4. Google Analytics: Optional (you can disable for now)
5. Click **"Create project"**
6. Wait for project creation (takes ~30 seconds)

### 2. Register Web App

1. In Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `Falcon Furniture Web`
3. **Do NOT** check "Firebase Hosting" (we're using Vercel)
4. Click **"Register app"**
5. **IMPORTANT**: Copy the `firebaseConfig` object - you'll need this later
6. Click **"Continue to console"**

### 3. Enable Authentication

1. In left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Toggle **"Enable"** switch
6. Click **"Save"**

#### Add Admin User

1. Go to **"Users"** tab
2. Click **"Add user"**
3. Enter:
   - **Email**: `admin@falconfurniture.com`
   - **Password**: `admin123` (or create a secure password)
4. Click **"Add user"**

### 4. Enable Realtime Database

1. In left sidebar, click **"Realtime Database"**
2. Click **"Create Database"**
3. Select location: Choose closest to your users (e.g., `us-central1`)
4. Security rules: Select **"Start in test mode"** (for development)
5. Click **"Enable"**

#### Update Database Rules

1. Go to **"Rules"** tab
2. Replace the rules with:

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

3. Click **"Publish"**

**What this does:**
- Anyone can read products/banners (public website)
- Only authenticated users can write (admin only)

### 5. Enable Storage

1. In left sidebar, click **"Storage"**
2. Click **"Get started"**
3. Security rules: Select **"Start in test mode"**
4. Select location: Same as database
5. Click **"Done"**

#### Update Storage Rules

1. Go to **"Rules"** tab
2. Replace the rules with:

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

3. Click **"Publish"**

### 6. Get Configuration Values

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Find your web app
5. Click **"Config"** radio button (not npm)
6. Copy the configuration object

You should see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "falcon-furniture-xxxxx.firebaseapp.com",
  projectId: "falcon-furniture-xxxxx",
  storageBucket: "falcon-furniture-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  databaseURL: "https://falcon-furniture-xxxxx-default-rtdb.firebaseio.com"
};
```

### 7. Update firebase-config.js

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com"
};
```

3. Save the file

### 8. Deploy to Vercel

If you're using Vercel (which you are):

1. Commit the changes:
```bash
git add firebase-config.js
git commit -m "Added Firebase configuration"
git push
```

2. Vercel will automatically deploy the changes

### 9. Test the Integration

1. Visit your admin login page:
   - Local: `http://localhost:8000/admin-login.html`
   - Live: `https://falcon-furniture-sigma.vercel.app/admin-login.html`

2. Login with:
   - Email: `admin@falconfurniture.com`
   - Password: `admin123` (or your password)

3. Add a test product:
   - Fill in product details
   - Upload an image
   - Click "Add Product"

4. Verify in Firebase Console:
   - Go to **Realtime Database**
   - You should see `products` node with your data
   - Go to **Storage**
   - You should see uploaded image in `products/` folder

## Troubleshooting

### Error: "Firebase is not defined"
- **Cause**: Firebase SDK not loaded
- **Fix**: Check that Firebase scripts are included in HTML before `firebase-config.js`

### Error: "Permission denied"
- **Cause**: Database/Storage rules not configured
- **Fix**: Update rules as shown in steps 4 and 5

### Error: "Invalid email or password"
- **Cause**: Admin user not created in Firebase Authentication
- **Fix**: Add user in Firebase Console → Authentication → Users

### Error: "Network request failed"
- **Cause**: Incorrect Firebase configuration
- **Fix**: Double-check all values in `firebase-config.js`

### Images not uploading
- **Cause**: Storage not enabled or rules incorrect
- **Fix**: Enable Storage and update rules as shown in step 5

### Data not syncing in real-time
- **Cause**: Using localStorage fallback instead of Firebase
- **Fix**: Check browser console for Firebase errors

## Security Best Practices

### For Production:

1. **Update Database Rules**:
```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null && auth.token.email == 'admin@falconfurniture.com'"
    },
    "banners": {
      ".read": true,
      ".write": "auth != null && auth.token.email == 'admin@falconfurniture.com'"
    }
  }
}
```

2. **Update Storage Rules**:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.email == 'admin@falconfurniture.com';
    }
    match /banners/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.email == 'admin@falconfurniture.com';
    }
  }
}
```

3. **Use Environment Variables** (for sensitive data):
   - Don't commit `firebase-config.js` with real credentials to public repos
   - Use Vercel environment variables instead

4. **Enable App Check** (optional):
   - Protects your Firebase resources from abuse
   - Go to Firebase Console → App Check

## Cost Considerations

Firebase Free Tier (Spark Plan) includes:
- **Authentication**: 10,000 verifications/month
- **Realtime Database**: 1 GB storage, 10 GB/month download
- **Storage**: 5 GB storage, 1 GB/day download
- **Hosting**: 10 GB storage, 360 MB/day transfer

This is more than enough for a small to medium furniture store.

## Next Steps

After Firebase is set up:

1. ✅ Test admin login
2. ✅ Add real products with images
3. ✅ Add hero banners
4. Consider adding:
   - Order management system
   - Customer management
   - Email notifications (Firebase Cloud Functions)
   - Analytics dashboard
   - Inventory tracking

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase Console for service status
3. Review Firebase documentation: https://firebase.google.com/docs
4. Check this project's README.md

## Summary Checklist

- [ ] Created Firebase project
- [ ] Registered web app
- [ ] Enabled Email/Password authentication
- [ ] Created admin user
- [ ] Enabled Realtime Database
- [ ] Updated database rules
- [ ] Enabled Storage
- [ ] Updated storage rules
- [ ] Copied Firebase configuration
- [ ] Updated firebase-config.js
- [ ] Committed and pushed changes
- [ ] Tested admin login
- [ ] Tested adding product
- [ ] Verified data in Firebase Console

Once all items are checked, your Firebase integration is complete! 🎉
