const mongoose = require('mongoose');

const TopIndexFutureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  change: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  __v: {
    type: Number,
    default: 0,
  },

  // Price history (maps to stockChartData from the given data)
  priceHistory: [{
    date: String, // e.g., "2025-05-24T09:15:00"
    price: Number, // Stock price in ₹
  }],

  // Group performance, events, and news into one nested object called details
  details: {
    performance: {
      todaysLow: String,
      todaysHigh: String,
      low52Week: String,
      high52Week: String,
      todayCurrent: String, // Added to store current price from overviewData.todayCurrent
      open: String,
      prevClose: String,
      volume: String,
      totalTradedValue: String, // Added to store "Avg. Traded Price" from stats
      upperCircuit: String,
      lowerCircuit: String,
    },
    events: [String], // Updated to an array of strings to match the data
    news: [{
      source: String, // e.g., "Economic Times"
      timestamp: String, // e.g., "2 hours ago"
      headline: String, // e.g., "Tata Motors unveils new electric vehicle lineup..."
      highlight: Boolean, // Added to match the given data's highlight field
    }],
  },

  // Market Depth (maps to overviewData.bidData and askData)
  marketDepth: {
    buyOrderQuantity: Number, // Will calculate from bidData
    sellOrderQuantity: Number, // Will calculate from askData
    buyOrders: [{ price: String, quantity: Number }],
    sellOrders: [{ price: String, quantity: Number }],
    bidTotal: Number,
    askTotal: Number,
  },

  // Fundamentals (maps to overviewData.fundamentals and stats)
  fundamentals: {
    marketCap: String, // e.g., "₹2,35,000 Cr"
    peRatioTTM: Number, // e.g., 18.5
    pbRatio: Number, // e.g., 3.2
    industryPE: Number, // e.g., 47.33 (not provided, will add a default)
    debtToEquity: Number, // e.g., 0.9
    roe: Number, // e.g., 15.8
    epsTTM: Number, // e.g., 30.37 (not provided, will calculate or add a default)
    dividendYield: Number, // e.g., 1.2
    bookValue: Number, // e.g., 200.53 (not provided, will add a default)
    faceValue: Number, // e.g., 5 (not provided, will add a default)
  },

  // Financials (maps to financialData)
  financials: {
    quarterly: [{
      quarter: String, // e.g., "Q1 2024"
      revenue: Number, // in ₹ Cr.
      profit: Number, // in ₹ Cr.
      netWorth: Number, // in ₹ Cr. (not provided in given data, will add defaults)
    }],
    yearly: [{
      quarter: String, // e.g., "Q1 2024"
      revenue: Number, // in ₹ Cr.
      profit: Number, // in ₹ Cr. // in ₹ Cr. (not provided in given data, will add defaults)
    }],
  },

  // About Section (maps to aboutData)
  about: {
    description: String,
    parentOrganisation: String,
    nseSymbol: String,
    managingDirector: String,
  },
});


module.exports = mongoose.model('TopIndexFuture', TopIndexFutureSchema);
