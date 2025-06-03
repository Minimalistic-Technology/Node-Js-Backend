const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    totalReturns: Number,
    value: Number
});

module.exports = mongoose.model('Investment', investmentSchema);