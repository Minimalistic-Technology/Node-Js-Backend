"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const router = express_1.default.Router();
router.post('/cart', cartController_1.addToCart);
router.get('/cart/:userId', cartController_1.getCart);
router.put('/cart/:id', cartController_1.updateCartItem);
router.delete('/cart/:id', cartController_1.deleteCartItem);
exports.default = router;
