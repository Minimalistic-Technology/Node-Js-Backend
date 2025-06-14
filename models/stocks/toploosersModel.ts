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

interface Performance {
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
}

interface OrderEntry {
  price: string;
  quantity: number;
}

interface Fundamentals {
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
}

interface FinancialEntry {
  quarter: string;
  revenue: number;
  profit: number;
  netWorth?: number;
}

interface About {
  description: string;
  parentOrganisation: string;
  nseSymbol: string;
  managingDirector: string;
}

export interface TopLoserDocument extends Document {
  category: 'large' | 'mid' | 'small';
  categoryId?: mongoose.Types.ObjectId;
  name: string;
  price: string;
  change: string;
  image: string;
  priceHistory: PriceHistoryEntry[];
  details: {
    performance: Performance;
    events: string[];
    news: NewsEntry[];
  };
  marketDepth: {
    buyOrderQuantity: number;
    sellOrderQuantity: number;
    buyOrders: OrderEntry[];
    sellOrders: OrderEntry[];
    bidTotal: number;
    askTotal: number;
  };
  fundamentals: Fundamentals;
  financials: {
    quarterly: FinancialEntry[];
    yearly: Omit<FinancialEntry, 'netWorth'>[]; // yearly doesn't include netWorth
  };
  about: About;
}

const TopLosersSchema = new Schema<TopLoserDocument>({
  category: {
    type: String,
    enum: ['large', 'mid', 'small'],
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  name: { type: String, required: true },
  price: { type: String, required: true },
  change: { type: String, required: true },
  image: { type: String, required: true },
  __v: { type: Number, default: 0 },

  priceHistory: [
    {
      date: String,
      price: Number,
    },
  ],

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
    news: [
      {
        source: String,
        timestamp: String,
        headline: String,
        highlight: Boolean,
      },
    ],
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
    quarterly: [
      {
        quarter: String,
        revenue: Number,
        profit: Number,
        netWorth: Number,
      },
    ],
    yearly: [
      {
        quarter: String,
        revenue: Number,
        profit: Number,
      },
    ],
  },

  about: {
    description: String,
    parentOrganisation: String,
    nseSymbol: String,
    managingDirector: String,
  },
});

const TopLosers: Model<TopLoserDocument> = mongoose.model<TopLoserDocument>(
  'TopLosers',
  TopLosersSchema
);

export default TopLosers;
