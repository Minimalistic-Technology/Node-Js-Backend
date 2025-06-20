"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mtfSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    change: { type: String, required: true },
    image: { type: String, required: true },
    __v: { type: Number, default: 0 },
    priceHistory: [{
            date: String,
            price: Number,
        }],
    details: {
        performance: {
            todaysLow: String,
            todaysHigh: String,
            low52Week: String,
            high52Week: String,
            todayCurrent: String,
            open: String,
            prevClose: String,
            volume: String,
            totalTradedValue: String,
            upperCircuit: String,
            lowerCircuit: String,
        },
        events: [String],
        news: [{
                source: String,
                timestamp: String,
                headline: String,
                highlight: Boolean,
            }]
    },
    marketDepth: {
        buyOrderQuantity: Number,
        sellOrderQuantity: Number,
        buyOrders: [{ price: String, quantity: Number }],
        sellOrders: [{ price: String, quantity: Number }],
        bidTotal: Number,
        askTotal: Number,
    },
    fundamentals: {
        marketCap: String,
        peRatioTTM: Number,
        pbRatio: Number,
        industryPE: Number,
        debtToEquity: Number,
        roe: Number,
        epsTTM: Number,
        dividendYield: Number,
        bookValue: Number,
        faceValue: Number,
    },
    financials: {
        quarterly: [{
                quarter: String,
                revenue: Number,
                profit: Number,
                netWorth: Number,
            }],
        yearly: [{
                quarter: String,
                revenue: Number,
                profit: Number,
            }],
    },
    about: {
        description: String,
        parentOrganisation: String,
        nseSymbol: String,
        managingDirector: String,
    }
});
const MTFStock = mongoose_1.default.model('Mtfschema', mtfSchema);
exports.default = MTFStock;
