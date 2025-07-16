import { Request, Response } from 'express';
import BookReview, { IReview } from '../models/review';

// Create a new review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, rating, review } = req.body;

    // Validate required fields
    if (!name || !email || !rating || !review) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    const newReview: IReview = new BookReview({
      name,
      email,
      rating,
      review,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch all reviews
export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await BookReview.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch a review by ID
export const getReviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await BookReview.findById(req.params.id);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a review by ID
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, rating, review } = req.body;

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    const updatedReview = await BookReview.findByIdAndUpdate(
      req.params.id,
      { name, email, rating, review },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a review by ID
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedReview = await BookReview.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}