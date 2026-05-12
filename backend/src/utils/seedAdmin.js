const User = require('../models/User');

// Create admin user if doesn't exist
const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@falconfurniture.com';
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            return;
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: adminEmail,
            phone: '9999999999',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            role: 'admin'
        });

        console.log('✅ Admin user created successfully');
        console.log(`📧 Email: ${admin.email}`);
        console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
    }
};

module.exports = seedAdmin;
