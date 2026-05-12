const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id })
            .populate('items.product', 'name price image stock category badge');

        if (!wishlist) {
            // Create empty wishlist if doesn't exist
            wishlist = await Wishlist.create({ user: req.user.id, items: [] });
        }

        res.status(200).json({
            success: true,
            wishlist
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
exports.addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide product ID'
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (!product.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Product is not available'
            });
        }

        // Get or create wishlist
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, items: [] });
        }

        // Check if already in wishlist
        if (wishlist.hasProduct(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }

        // Add item to wishlist
        await wishlist.addItem(productId);

        // Populate and return updated wishlist
        wishlist = await Wishlist.findById(wishlist._id)
            .populate('items.product', 'name price image stock category badge');

        res.status(200).json({
            success: true,
            message: 'Item added to wishlist',
            wishlist
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        await wishlist.removeItem(productId);

        // Populate and return updated wishlist
        wishlist = await Wishlist.findById(wishlist._id)
            .populate('items.product', 'name price image stock category badge');

        res.status(200).json({
            success: true,
            message: 'Item removed from wishlist',
            wishlist
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist/clear
// @access  Private
exports.clearWishlist = async (req, res, next) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        await wishlist.clearWishlist();

        res.status(200).json({
            success: true,
            message: 'Wishlist cleared successfully',
            wishlist
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.checkWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                inWishlist: false
            });
        }

        const inWishlist = wishlist.hasProduct(productId);

        res.status(200).json({
            success: true,
            inWishlist
        });
    } catch (error) {
        next(error);
    }
};
