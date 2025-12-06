import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import Comment from '../models/Comment';
import Post from '../models/Post';

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This should be called after requireAuth middleware, so req.user should exist
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Authentication required'
      });
    }

    const { id } = req.params;

    if (!id || !id.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Comment ID is required'
      });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid comment ID format'
      });
    }

    // Find the comment
    const comment = await Comment.findById(id.trim()).lean().exec();

    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Comment not found'
      });
    }

    // Check if user is the comment author
    const isCommentAuthor = comment.author && comment.author.toString() === req.user.id;

    // If not comment author, check if user is the post author
    let isPostAuthor = false;
    if (!isCommentAuthor) {
      const post = await Post.findById(comment.postId).lean().exec();
      if (post && post.author) {
        isPostAuthor = post.author.toString() === req.user.id;
      }
    }

    // Only allow deletion if user is comment author OR post author
    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'You do not have permission to delete this comment'
      });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(id.trim());

    // Return 204 No Content
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

