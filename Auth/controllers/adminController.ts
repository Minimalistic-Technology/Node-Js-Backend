import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import User, { IUser, UserRole, UserStatus } from '../models/User';
import Blog from '../models/Blog';
import Quote from '../models/Quote';
import AuditLog, { IAuditLog } from '../models/AuditLog';
import { formatUser } from '../utils/formatters';

const buildUserFilters = (query: Request['query']): FilterQuery<IUser> => {
  const filters: FilterQuery<IUser> = {};

  if (typeof query.status === 'string' && ['active', 'inactive'].includes(query.status)) {
    filters.status = query.status as UserStatus;
  }

  if (
    typeof query.role === 'string' &&
    ['user', 'admin', 'super-admin'].includes(query.role)
  ) {
    filters.role = query.role as UserRole;
  }

  if (typeof query.search === 'string' && query.search.trim().length > 0) {
    const search = query.search.trim();
    filters.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  return filters;
};

const generateSlug = async (title: string, existingId?: string): Promise<string> => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let slug = baseSlug || `post-${Date.now()}`;
  let counter = 1;

  // ensure unique slug
  while (true) {
    const existing = await Blog.findOne({ slug });
    if (!existing || (existingId && existing.id === existingId)) {
      break;
    }
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};

export const listUsers = CatchAsyncError(async (req: Request, res: Response) => {
  const filters = buildUserFilters(req.query);
  const users = await User.find(filters).sort({ createdAt: -1 });

  res.status(200).json({
    users: users.map((user) => formatUser(user)),
  });
});

export const updateUserStatus = CatchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status?: UserStatus };

  if (!status || !['active', 'inactive'].includes(status)) {
    throw new ErrorHandler('Invalid status provided', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ErrorHandler('User not found', 404);
  }

  if (user.role === 'super-admin' && req.currentUser?.role !== 'super-admin') {
    throw new ErrorHandler('You cannot deactivate a super admin', 403);
  }

  user.status = status;
  await user.save();

  await AuditLog.create({
    actor: req.currentUser?._id,
    action: 'status-change',
    entity: 'user',
    entityId: user.id,
    metadata: { status },
  });

  res.status(200).json({
    message: `User status updated to ${status}`,
    user: formatUser(user),
  });
});

export const updateUserRole = CatchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body as { role?: UserRole };

  if (!role || !['user', 'admin', 'super-admin'].includes(role)) {
    throw new ErrorHandler('Invalid role provided', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ErrorHandler('User not found', 404);
  }

  if (req.currentUser?.role !== 'super-admin') {
    throw new ErrorHandler('Only super admins can change user roles', 403);
  }

  if (user.id === req.currentUser.id) {
    throw new ErrorHandler('You cannot change your own role', 400);
  }

  user.role = role;
  await user.save();

  await AuditLog.create({
    actor: req.currentUser?._id,
    action: 'role-change',
    entity: 'user',
    entityId: user.id,
    metadata: { role },
  });

  res.status(200).json({
    message: `User role updated to ${role}`,
    user: formatUser(user),
  });
});

export const createBlog = CatchAsyncError(async (req: Request, res: Response) => {
  const { title, content, published = true, tags = [] } = req.body;

  if (!title || !content) {
    throw new ErrorHandler('Title and content are required', 400);
  }

  const blog = await Blog.create({
    title,
    slug: await generateSlug(title),
    content,
    published,
    tags,
    author: req.currentUser?._id,
  });

  await AuditLog.create({
    actor: req.currentUser?._id,
    action: 'create',
    entity: 'blog',
    entityId: blog.id,
    metadata: { title: blog.title },
  });

  res.status(201).json({ message: 'Blog created successfully', blog });
});

export const listBlogs = CatchAsyncError(async (_req: Request, res: Response) => {
  const blogs = await Blog.find().populate('author', 'username email role').sort({ createdAt: -1 });
  res.status(200).json({ blogs });
});

export const getBlog = CatchAsyncError(async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'username email role');

  if (!blog) {
    throw new ErrorHandler('Blog not found', 404);
  }

  res.status(200).json({ blog });
});

export const updateBlog = CatchAsyncError(async (req: Request, res: Response) => {
  const { title, content, published, tags } = req.body;
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ErrorHandler('Blog not found', 404);
  }

  if (title) {
    blog.title = title;
    blog.slug = await generateSlug(title, blog.id);
  }

  if (typeof content === 'string') {
    blog.content = content;
  }

  if (typeof published === 'boolean') {
    blog.published = published;
  }

  if (Array.isArray(tags)) {
    blog.tags = tags;
  }

  await blog.save();

  await AuditLog.create({
    actor: req.currentUser?._id,
    action: 'update',
    entity: 'blog',
    entityId: blog.id,
    metadata: { title: blog.title },
  });

  res.status(200).json({ message: 'Blog updated successfully', blog });
});

export const deleteBlog = CatchAsyncError(async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ErrorHandler('Blog not found', 404);
  }

  await blog.deleteOne();

  await AuditLog.create({
    actor: req.currentUser?._id,
    action: 'delete',
    entity: 'blog',
    entityId: blog.id,
    metadata: { title: blog.title },
  });

  res.status(200).json({ message: 'Blog deleted successfully' });
});

export const createQuote = CatchAsyncError(async (req: Request, res: Response) => {
  const { text, authorName } = req.body;

  if (!text) {
    throw new ErrorHandler('Quote text is required', 400);
  }

  const quote = await Quote.create({
    text,
    authorName,
    author: req.currentUser?._id,
  });

  await AuditLog.create({
    actor: req.currentUser?._id,
    action: 'create',
    entity: 'quote',
    entityId: quote.id,
    metadata: { text: quote.text.slice(0, 80) },
  });

  res.status(201).json({ message: 'Quote created successfully', quote });
});

export const listQuotes = CatchAsyncError(async (_req: Request, res: Response) => {
  const quotes = await Quote.find()
    .populate('author', 'username email role')
    .sort({ createdAt: -1 });

  res.status(200).json({ quotes });
});

export const updateQuote = CatchAsyncError(async (req: Request, res: Response) => {
  const { text, authorName } = req.body;
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    throw new ErrorHandler('Quote not found', 404);
  }

  if (typeof text === 'string') {
    quote.text = text;
  }

  if (typeof authorName === 'string') {
    quote.authorName = authorName;
  }

  await quote.save();

  await AuditLog.create({
    actor: req.currentUser?._id,
    action: 'update',
    entity: 'quote',
    entityId: quote.id,
    metadata: { text: quote.text.slice(0, 80) },
  });

  res.status(200).json({ message: 'Quote updated successfully', quote });
});

export const deleteQuote = CatchAsyncError(async (req: Request, res: Response) => {
  const quote = await Quote.findById(req.params.id);

  if (!quote) {
    throw new ErrorHandler('Quote not found', 404);
  }

  await quote.deleteOne();

  await AuditLog.create({
    actor: req.currentUser?._id,
    action: 'delete',
    entity: 'quote',
    entityId: quote.id,
    metadata: { text: quote.text.slice(0, 80) },
  });

  res.status(200).json({ message: 'Quote deleted successfully' });
});

export const getDashboardStats = CatchAsyncError(async (_req: Request, res: Response) => {
  const [totalUsers, totalBlogs, totalQuotes, latestBlogs, latestQuotes] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments(),
    Quote.countDocuments(),
    Blog.find().sort({ createdAt: -1 }).limit(5).select('title slug createdAt updatedAt'),
    Quote.find().sort({ createdAt: -1 }).limit(5).select('text authorName createdAt'),
  ]);

  res.status(200).json({
    totals: {
      users: totalUsers,
      blogs: totalBlogs,
      quotes: totalQuotes,
    },
    latest: {
      blogs: latestBlogs,
      quotes: latestQuotes,
    },
    meta: {
      autoRefreshSuggestedIntervalMs: 30000,
    },
  });
});

export const getAuditLogs = CatchAsyncError(async (req: Request, res: Response) => {
  const { action, entity, limit = '50' } = req.query;

  const filters: FilterQuery<IAuditLog> = {};

  if (typeof action === 'string') {
    filters.action = action;
  }

  if (typeof entity === 'string') {
    filters.entity = entity;
  }

  const parsedLimit = Math.min(parseInt(limit as string, 10) || 50, 200);

  const logs = await AuditLog.find(filters)
    .populate('actor', 'username email role')
    .sort({ createdAt: -1 })
    .limit(parsedLimit);

  res.status(200).json({ logs });
});

export const getProfile = CatchAsyncError(async (req: Request, res: Response) => {
  if (!req.currentUser) {
    throw new ErrorHandler('User not found', 404);
  }

  res.status(200).json({ user: formatUser(req.currentUser) });
});

export const updateProfile = CatchAsyncError(async (req: Request, res: Response) => {
  const user = req.currentUser;

  if (!user) {
    throw new ErrorHandler('User not found', 404);
  }

  const { username, email, themePreference, password, currentPassword } = req.body as {
    username?: string;
    email?: string;
    themePreference?: string;
    password?: string;
    currentPassword?: string;
  };

  let hasChanges = false;

  if (typeof username === 'string' && username.trim().length > 0 && username !== user.username) {
    user.username = username.trim();
    hasChanges = true;
  }

  if (typeof email === 'string' && email.trim().length > 0 && email !== user.email) {
    const existingEmail = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: user.id } });
    if (existingEmail) {
      throw new ErrorHandler('Email already in use', 409);
    }
    user.email = email.trim().toLowerCase();
    hasChanges = true;
  }

  if (typeof themePreference === 'string' && ['light', 'dark', 'system'].includes(themePreference)) {
    user.themePreference = themePreference as typeof user.themePreference;
    hasChanges = true;
  }

  if (typeof password === 'string') {
    if (!currentPassword) {
      throw new ErrorHandler('Current password is required to set a new password', 400);
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new ErrorHandler('Current password is incorrect', 401);
    }

    user.password = password;
    user.markPasswordChanged();
    hasChanges = true;
  }

  if (!hasChanges) {
    res.status(200).json({ message: 'No changes detected', user: formatUser(user) });
    return;
  }

  await user.save();

  await AuditLog.create({
    actor: user._id,
    action: 'update',
    entity: 'profile',
    entityId: user.id,
    metadata: {
      hasPasswordChange: Boolean(password),
      themePreference: user.themePreference,
    },
  });

  res.status(200).json({
    message: 'Profile updated successfully',
    user: formatUser(user),
  });
});

