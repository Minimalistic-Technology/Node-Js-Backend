const mongoose = require('mongoose');

const goldPriceSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('GoldPrice', goldPriceSchema);