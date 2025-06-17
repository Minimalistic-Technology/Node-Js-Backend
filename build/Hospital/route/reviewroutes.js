"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_1 = __importDefault(require("../../controllers/hospital/review"));
const router = (0, express_1.Router)();
// Route to get all reviews
router.get('/reviews', review_1.default.getReviews);
// Route to get a specific review by ID
router.get('/reviews/:id', review_1.default.getReviewById);
// Route to create a new review
router.post('/reviews', review_1.default.createReview);
// Route to update a review by ID
router.put('/reviews/:id', review_1.default.updateReview);
// Route to delete a review by ID
router.delete('/reviews/:id', review_1.default.deleteReview);
exports.default = router;
