# Cloudinary Setup Guide

## What You Need

To complete the Cloudinary integration, you need:
1. **Cloud Name** - Your Cloudinary account identifier
2. **Upload Preset** - An unsigned upload preset for browser uploads
3. **API Key** - Already provided: `oqFcLeSBtVSTE81JOFXT4mfBMyg`

## How to Get Your Cloud Name

### Step 1: Login to Cloudinary
1. Go to https://cloudinary.com/
2. Login to your account

### Step 2: Find Your Cloud Name
1. Once logged in, you'll see your **Dashboard**
2. At the top, you'll see: **Account Details**
3. Look for **Cloud name**: `your-cloud-name`
4. Copy this value

## How to Create an Upload Preset

### Step 1: Go to Settings
1. Click the **gear icon** (⚙️) in the top right
2. Select **Upload** from the left sidebar

### Step 2: Create Upload Preset
1. Scroll down to **Upload presets** section
2. Click **Add upload preset** button
3. Configure the preset:
   - **Preset name**: `falcon_furniture_unsigned`
   - **Signing Mode**: Select **Unsigned** ⚠️ (Important!)
   - **Folder**: `falcon-furniture` (optional)
   - **Use filename**: Yes (optional)
   - **Unique filename**: Yes (recommended)
4. Click **Save**

### Step 3: Copy the Preset Name
1. After saving, you'll see your preset in the list
2. Copy the **preset name** (e.g., `falcon_furniture_unsigned`)

## Update Configuration

Once you have both values, share them with me:
- **Cloud Name**: `your-cloud-name`
- **Upload Preset**: `falcon_furniture_unsigned`

I'll update the `cloudinary-config.js` file with these values.

## Why Unsigned Upload?

Unsigned uploads allow your browser to upload images directly to Cloudinary without exposing your API secret. This is:
- ✅ Secure (no API secret in browser)
- ✅ Fast (direct upload from browser)
- ✅ Simple (no backend needed)

## What Happens When You Upload

1. User selects image in admin dashboard
2. Image is uploaded directly to Cloudinary
3. Cloudinary returns a secure URL
4. URL is saved to Firebase Database
5. Image is displayed on your website

## Folder Structure in Cloudinary

Images will be organized as:
```
falcon-furniture/
├── products/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
└── banners/
    ├── banner1.jpg
    ├── banner2.jpg
    └── ...
```

## Next Steps

1. Get your Cloud Name from Cloudinary Dashboard
2. Create an unsigned upload preset
3. Share both values with me
4. I'll update the configuration
5. Test by uploading a product image!
