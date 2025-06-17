import { Request, Response } from 'express';
import DoctorReview, { IReview } from '../../models/hospital/doctorreview';

// Create a new review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctor, review, rating, privacyAgreed } = req.body;

    if (!doctor  || !review || !rating || privacyAgreed === undefined) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    if (!privacyAgreed) {
      res.status(400).json({ message: 'You must agree to the privacy policy' });
      return;
    }

    const newReview: IReview = new DoctorReview({
      doctor,
      review,
      rating,
      privacyAgreed,
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
    const reviews = await DoctorReview.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch a review by ID
export const getReviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await DoctorReview.findById(req.params.id);
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
    const { nameOrInitials, department, review, rating, privacyAgreed } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    if (privacyAgreed !== undefined && !privacyAgreed) {
      res.status(400).json({ message: 'You must agree to the privacy policy' });
      return;
    }

    const updatedReview = await DoctorReview.findByIdAndUpdate(
      req.params.id,
      { nameOrInitials, department, review, rating, privacyAgreed },
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
    const deletedReview = await DoctorReview.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};