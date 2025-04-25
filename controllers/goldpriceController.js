const GoldPrice = require('../models/GoldPrice');
const moment = require('moment');

exports.getTodayPrice = async (req, res) => {
    const today = require('moment')().format('YYYY-MM-DD');
    try {
        const price = await GoldPrice.findOne({ date: today });

        if (!price) {
            return res.status(404).json({ message: 'No price found for today' });
        }

        res.json({ date: today, price: price.price });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addPrice = async (req, res) => {
    const { date, price } = req.body;

    try {
        const newPrice = new GoldPrice({ date, price });
        await newPrice.save();
        res.status(201).json(newPrice);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updatePrice = async (req, res) => {
    const { date } = req.params;
    const { price } = req.body;

    try {
        const updated = await GoldPrice.findOneAndUpdate(
            { date },
            { price },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Date not found' });
        
        res.json({ message: 'Gold price updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};