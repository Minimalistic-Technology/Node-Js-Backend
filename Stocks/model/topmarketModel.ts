import mongoose, { Schema, Document, Model } from 'mongoose';

interface PricePoint {
  date: string;
  price: number;
}

interface Event {
  date: string;
  title: string;
  subtitle: string;
  amount?: string;
  link?: string;
}

interface NewsItem {
  source: string;
  timestamp: string;
  headline: string;
  highlight: boolean;
}

interface Order {
  price: string;
  quantity: number;
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

export interface TopMarketDocument extends Document {
  name: string;
  price: string;
  change: string;
  image: string;
  __v: number;
  priceHistory: PricePoint[];
  details: {
    performance: Performance;
    events: Event[];
    news: NewsItem[];
  };
  marketDepth: {
    buyOrderQuantity: number;
    sellOrderQuantity: number;
    buyOrders: Order[];
    sellOrders: Order[];
    bidTotal: number;
    askTotal: number;
  };
  fundamentals: Fundamentals;
  financials: {
    quarterly: FinancialEntry[];
    yearly: Omit<FinancialEntry, 'netWorth'>[];
  };
  about: About;
}

const TopMarketSchema = new Schema<TopMarketDocument>({
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
    events: [
      {
        date: String,
        title: String,
        subtitle: String,
        amount: String,
        link: String,
      },
    ],
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

const TopMarket: Model<TopMarketDocument> = mongoose.model<TopMarketDocument>(
  'Topmarket',
  TopMarketSchema
);

export default TopMarket;
