"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const TopTradedSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    change: { type: String, required: true },
    image: { type: String, required: true },
    priceHistory: [{ date: String, price: Number }],
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
        news: [{ source: String, timestamp: String, headline: String, highlight: Boolean }],
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
        quarterly: [{ quarter: String, revenue: Number, profit: Number, netWorth: Number }],
        yearly: [{ quarter: String, revenue: Number, profit: Number }],
    },
    about: {
        description: String,
        parentOrganisation: String,
        nseSymbol: String,
        managingDirector: String,
    },
});
const TopTradedModel = mongoose_1.default.model('TopTraded', TopTradedSchema);
exports.default = TopTradedModel;
