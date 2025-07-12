"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.post('/cart', cart_controller_1.addToCart);
router.get('/cart/:userId', cart_controller_1.getCart);
router.put('/cart/:id', cart_controller_1.updateCartItem);
router.delete('/cart/:id', cart_controller_1.deleteCartItem);
exports.default = router;
