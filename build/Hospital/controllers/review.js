"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getReviewById = exports.getReviews = exports.createReview = void 0;
const review_1 = __importDefault(require("../models/review"));
// Create a new review
const createReview = async (req, res) => {
    try {
        const { nameOrInitials, department, review, rating, privacyAgreed } = req.body;
        // Validate required fields
        if (!nameOrInitials || !department || !review || !rating || privacyAgreed === undefined) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        // Validate rating
        if (rating < 1 || rating > 5) {
            res.status(400).json({ message: 'Rating must be between 1 and 5' });
            return;
        }
        // Validate privacy agreement
        if (!privacyAgreed) {
            res.status(400).json({ message: 'You must agree to the privacy policy' });
            return;
        }
        const newReview = new review_1.default({
            nameOrInitials,
            department,
            review,
            rating,
            privacyAgreed,
        });
        await newReview.save();
        res.status(201).json({ message: 'Review submitted successfully', review: newReview });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createReview = createReview;
// Fetch all reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await review_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getReviews = getReviews;
// Fetch a review by ID
const getReviewById = async (req, res) => {
    try {
        const review = await review_1.default.findById(req.params.id);
        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        res.status(200).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getReviewById = getReviewById;
// Update a review by ID
const updateReview = async (req, res) => {
    try {
        const { nameOrInitials, department, review, rating, privacyAgreed } = req.body;
        // Validate rating if provided
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            res.status(400).json({ message: 'Rating must be between 1 and 5' });
            return;
        }
        // Validate privacy agreement if provided
        if (privacyAgreed !== undefined && !privacyAgreed) {
            res.status(400).json({ message: 'You must agree to the privacy policy' });
            return;
        }
        const updatedReview = await review_1.default.findByIdAndUpdate(req.params.id, { nameOrInitials, department, review, rating, privacyAgreed }, { new: true, runValidators: true });
        if (!updatedReview) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateReview = updateReview;
// Delete a review by ID
const deleteReview = async (req, res) => {
    try {
        const deletedReview = await review_1.default.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deleteReview = deleteReview;
