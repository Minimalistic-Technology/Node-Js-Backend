import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import Post from '../models/Post';
import Comment from '../models/Comment';
import { createCommentSchema } from '../validators/commentValidator';

interface PostsQueryParams {
  tag?: string;
  q?: string;
  page?: string;
  limit?: string;
}

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tag, q, page, limit } = req.query as PostsQueryParams;

    // Parse pagination parameters
    const pageNumber = parseInt(page || '1', 10);
    const limitNumber = parseInt(limit || '10', 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Validate pagination
    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Page and limit must be positive integers'
      });
    }

    // Enforce maximum limit to prevent abuse
    const maxLimit = 100;
    const effectiveLimit = Math.min(limitNumber, maxLimit);

    // Build query for published posts only
    const query: any = { published: true };

    // Add tag filter if provided
    if (tag && tag.trim()) {
      query.tags = { $in: [tag.trim()] };
    }

    // Add text search if provided
    if (q && q.trim()) {
      query.$text = { $search: q.trim() };
    }

    // Build the find query
    const findQuery = Post.find(query);

    // If text search is used, sort by text score, otherwise by publishedAt
    if (q && q.trim()) {
      findQuery.sort({ score: { $meta: 'textScore' }, publishedAt: -1 });
    } else {
      findQuery.sort({ publishedAt: -1 });
    }

    // Execute query with pagination
    const [posts, totalCount] = await Promise.all([
      findQuery.skip(skip).limit(effectiveLimit).lean().exec(),
      Post.countDocuments(query)
    ]);

    return res.status(StatusCodes.OK).json({
      posts,
      pagination: {
        page: pageNumber,
        limit: effectiveLimit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / effectiveLimit),
        hasNextPage: skip + effectiveLimit < totalCount,
        hasPrevPage: pageNumber > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    if (!slug || !slug.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Slug is required'
      });
    }

    // Find post by slug and populate author
    const post = await Post.findOne({ slug: slug.trim().toLowerCase() })
      .populate('author', 'firstName lastName email')
      .lean()
      .exec();

    // Return 404 if post doesn't exist
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Post not found'
      });
    }

    // Return 404 if post is not published (for public requests)
    if (!post.published) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Post not found'
      });
    }

    // Format author summary
    const authorSummary = post.author
      ? {
          id: (post.author as any)._id || (post.author as any).id,
          firstName: (post.author as any).firstName,
          lastName: (post.author as any).lastName,
          email: (post.author as any).email
        }
      : null;

    // Remove author object and add authorSummary
    const { author, ...postData } = post;
    const response = {
      ...postData,
      author: authorSummary
    };

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;

    if (!postId || !postId.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Post ID is required'
      });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(postId.trim())) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid post ID format'
      });
    }

    // First verify the post exists and is published
    const post = await Post.findById(postId.trim()).lean().exec();

    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Post not found'
      });
    }

    // Return 404 if post is not published (for public requests)
    if (!post.published) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Post not found'
      });
    }

    // Get approved comments for this post, sorted by creation date (oldest first)
    const comments = await Comment.find({
      postId: new mongoose.Types.ObjectId(postId.trim()),
      approved: true
    })
      .populate('author', 'firstName lastName email')
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    // Format comments with author summary
    const formattedComments = comments.map((comment) => {
      const authorSummary = comment.author
        ? {
            id: (comment.author as any)._id || (comment.author as any).id,
            firstName: (comment.author as any).firstName,
            lastName: (comment.author as any).lastName,
            email: (comment.author as any).email
          }
        : comment.authorName && comment.authorEmail
        ? {
            name: comment.authorName,
            email: comment.authorEmail
          }
        : null;

      const { author, authorName, authorEmail, ...commentData } = comment;
      return {
        ...commentData,
        author: authorSummary
      };
    });

    return res.status(StatusCodes.OK).json({
      comments: formattedComments,
      count: formattedComments.length
    });
  } catch (error) {
    next(error);
  }
};

export const postComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This should be called after requireAuth middleware, so req.user should exist
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Authentication required'
      });
    }

    const { postId } = req.params;

    if (!postId || !postId.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Post ID is required'
      });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(postId.trim())) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid post ID format'
      });
    }

    // Validate comment content
    const { content } = createCommentSchema.parse(req.body);

    // Verify the post exists and is published
    const post = await Post.findById(postId.trim()).lean().exec();

    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Post not found'
      });
    }

    if (!post.published) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Post not found'
      });
    }

    // Create comment with authenticated user as author
    const comment = await Comment.create({
      postId: new mongoose.Types.ObjectId(postId.trim()),
      content,
      author: req.user.id,
      approved: false // Comments require approval by default
    });

    // Populate author for response
    await comment.populate('author', 'firstName lastName email');

    // Format author summary
    const authorSummary = comment.author
      ? {
          id: (comment.author as any)._id || (comment.author as any).id,
          firstName: (comment.author as any).firstName,
          lastName: (comment.author as any).lastName,
          email: (comment.author as any).email
        }
      : null;

    const { author, ...commentData } = comment.toObject();
    const response = {
      ...commentData,
      author: authorSummary
    };

    return res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

