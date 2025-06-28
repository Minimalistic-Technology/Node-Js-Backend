"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartItem = exports.updateCartItem = exports.getCart = exports.addToCart = void 0;
const cart_1 = require("../models/cart");
const addToCart = async (req, res) => {
    try {
        const cartItem = new cart_1.CartModel(req.body);
        const saved = await cartItem.save();
        res.status(201).json(saved);
    }
    catch {
        res.status(500).json({ error: 'Error adding to cart' });
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res) => {
    try {
        const items = await cart_1.CartModel.find({ userId: req.params.userId });
        res.json(items);
    }
    catch {
        res.status(500).json({ error: 'Error fetching cart' });
    }
};
exports.getCart = getCart;
const updateCartItem = async (req, res) => {
    try {
        const updated = await cart_1.CartModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            res.status(404).json({ error: 'Cart item not found' });
            return;
        }
        res.json(updated);
    }
    catch {
        res.status(500).json({ error: 'Error updating cart' });
    }
};
exports.updateCartItem = updateCartItem;
const deleteCartItem = async (req, res) => {
    try {
        const deleted = await cart_1.CartModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: 'Cart item not found' });
            return;
        }
        res.json({ message: 'Item removed from cart' });
    }
    catch {
        res.status(500).json({ error: 'Error deleting cart item' });
    }
};
exports.deleteCartItem = deleteCartItem;
