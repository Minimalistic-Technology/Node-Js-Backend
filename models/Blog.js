const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({ 
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    image: { type: String },
    date: { type: String, required: true },
    author: { type: String },
    tags: [{ type: String }]
});

module.exports = mongoose.model('Blog', blogSchema);