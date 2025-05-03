const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({ 
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    image: { type: String },
    date: { type: String, required: true },
    author: { type: String },
    tags: [{ type: String }],
    rating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Blog', blogSchema);