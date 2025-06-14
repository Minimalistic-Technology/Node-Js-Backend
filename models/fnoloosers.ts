import mongoose, { Schema, Document, Model } from 'mongoose';

interface PriceHistoryEntry {
  date: string;
  price: number;
}

interface NewsEntry {
  source: string;
  timestamp: string;
  headline: string;
  highlight: boolean;
}

interface BuySellOrder {
  price: string;
  quantity: number;
}

interface QuarterlyData {
  quarter: string;
  revenue: number;
  profit: number;
  netWorth: number;
}

interface YearlyData {
  quarter: string;
  revenue: number;
  profit: number;
}

export interface FNOLoosersDocument extends Document {
  name: string;
  icon: string;
  price: string;
  change: string;
  volume: string;

  priceHistory: PriceHistoryEntry[];

  details: {
    performance: {
      todaysLow: string;
      todaysHigh: string;
      low52Week: string;
      high52Week: string;
      todayCurrent: string;
      open: string;
      prevClose: string;
      volume: string;
      totalTradedValue: string;
      upperCircuit: string;
      lowerCircuit: string;
    };
    events: string[];
    news: NewsEntry[];
  };

  marketDepth: {
    buyOrderQuantity: number;
    sellOrderQuantity: number;
    buyOrders: BuySellOrder[];
    sellOrders: BuySellOrder[];
    bidTotal: number;
    askTotal: number;
  };

  fundamentals: {
    marketCap: string;
    peRatioTTM: number;
    pbRatio: number;
    industryPE: number;
    debtToEquity: number;
    roe: number;
    epsTTM: number;
    dividendYield: number;
    bookValue: number;
    faceValue: number;
  };

  financials: {
    quarterly: QuarterlyData[];
    yearly: YearlyData[];
  };

  about: {
    description: string;
    parentOrganisation: string;
    nseSymbol: string;
    managingDirector: string;
  };
}

const FNOLoosersSchema = new Schema<FNOLoosersDocument>({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  price: { type: String, required: true },
  change: { type: String, required: true },
  volume: { type: String, required: true },

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
    }],
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
  },
});

const FNOLoosers: Model<FNOLoosersDocument> = 
  mongoose.models.FNOLoosers || mongoose.model<FNOLoosersDocument>('FNOLoosers', FNOLoosersSchema);

export default FNOLoosers;
