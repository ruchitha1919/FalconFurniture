const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
    },
    category: {
        type: String,
        required: [true, 'Please provide product category'],
        enum: {
            values: ['Living Room', 'Bedroom', 'Office', 'Dining', 'Outdoor', 'Decor'],
            message: 'Please select a valid category'
        }
    },
    subcategory: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Please provide product image']
    },
    images: [{
        type: String
    }],
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    badge: {
        type: String,
        enum: ['New', 'Sale', 'Hot', 'Featured', ''],
        default: ''
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
    },
    numReviews: {
        type: Number,
        default: 0
    },
    specifications: {
        type: Map,
        of: String
    },
    colors: [{
        type: String
    }],
    sizes: [{
        type: String
    }],
    material: {
        type: String,
        trim: true
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
            type: String,
            default: 'cm'
        }
    },
    weight: {
        value: Number,
        unit: {
            type: String,
            default: 'kg'
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Calculate discount percentage if originalPrice is provided
productSchema.pre('save', function(next) {
    if (this.originalPrice && this.originalPrice > this.price) {
        this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    next();
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
    if (this.stock === 0) return 'Out of Stock';
    if (this.stock < 10) return 'Low Stock';
    return 'In Stock';
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
