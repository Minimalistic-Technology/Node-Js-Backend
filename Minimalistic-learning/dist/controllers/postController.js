import Post from '../models/Post';
import Comment from '../models/Comment';
export const listPosts = async (req, res) => {
    const { tag, q } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 10);
    const query = { published: true };
    if (tag)
        query.tags = tag;
    if (q)
        query.$text = { $search: String(q) };
    const skip = (page - 1) * limit;
    console.log("Post", Post.find({}));
    const [items, total] = await Promise.all([
        Post.find({})
            .select('title slug tags createdAt authorId')
            .populate('authorId', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Post.countDocuments(query)
    ]);
    res.json({ items, total });
};
export const getPostBySlug = async (req, res) => {
    const post = await Post.findOne({
        slug: req.params.slug,
        published: true
    })
        .populate('authorId', 'name')
        .select('-__v');
    if (!post)
        return res.sendStatus(404);
    res.json(post);
};
export const listComments = async (req, res) => {
    const post = await Post.findOne({
        _id: req.params.id,
        published: true
    });
    if (!post)
        return res.sendStatus(404);
    const comments = await Comment.find({ postId: req.params.id })
        .populate('authorId', 'name')
        .select('content createdAt authorId')
        .sort({ createdAt: 1 });
    res.json(comments);
};
export const createPost = async (req, res) => {
    const { title, content, tags, published } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content required' });
    }
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    try {
        const post = await Post.create({
            title,
            slug,
            content,
            tags,
            published: published ?? false,
            authorId: req.user.id
        });
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};
export const updatePost = async (req, res) => {
    const { title, content, tags, published } = req.body;
    try {
        const post = await Post.findOneAndUpdate({ _id: req.params.id, authorId: req.user.id }, { title, content, tags, published }, { new: true });
        if (!post)
            return res.sendStatus(404);
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
};
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, authorId: req.user.id });
        if (!post)
            return res.sendStatus(404);
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
};
