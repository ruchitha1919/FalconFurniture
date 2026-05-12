const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [wishlistItemSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
wishlistSchema.index({ user: 1 });

// Method to add item to wishlist
wishlistSchema.methods.addItem = function(productId) {
    const existingItem = this.items.find(item => item.product.toString() === productId.toString());
    
    if (!existingItem) {
        this.items.push({ product: productId });
        this.updatedAt = Date.now();
    }
    
    return this.save();
};

// Method to remove item from wishlist
wishlistSchema.methods.removeItem = function(productId) {
    this.items = this.items.filter(item => item.product.toString() !== productId.toString());
    this.updatedAt = Date.now();
    return this.save();
};

// Method to check if product is in wishlist
wishlistSchema.methods.hasProduct = function(productId) {
    return this.items.some(item => item.product.toString() === productId.toString());
};

// Method to clear wishlist
wishlistSchema.methods.clearWishlist = function() {
    this.items = [];
    this.updatedAt = Date.now();
    return this.save();
};

module.exports = mongoose.model('Wishlist', wishlistSchema);
