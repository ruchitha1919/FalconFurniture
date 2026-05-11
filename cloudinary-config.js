// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
    cloudName: 'drykxz5sw',
    uploadPreset: 'falcon_furniture_unsigned',
    apiKey: 'oqFcLeSBtVSTE81JOFXT4mfBMyg'
};

// Cloudinary Upload Function
async function uploadToCloudinary(file, folder = 'products') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', `falcon-furniture/${folder}`);
    formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.secure_url;  // Returns the Cloudinary URL
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}

// Export for use in other files
window.uploadToCloudinary = uploadToCloudinary;
window.CLOUDINARY_CONFIG = CLOUDINARY_CONFIG;
