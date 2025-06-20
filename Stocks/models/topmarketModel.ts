import mongoose, { Schema, Document, Model } from 'mongoose';

interface IPriceHistory {
  date: string;
  price: number;
}

interface IEvent {
  date: string;
  title: string;
  subtitle: string;
  amount?: string;
  link?: string;
}

interface INews {
  source: string;
  timestamp: string;
  headline: string;
  highlight: boolean;
}

interface IDetails {
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
  events: IEvent[];
  news: INews[];
}

interface IMarketDepth {
  buyOrderQuantity: number;
  sellOrderQuantity: number;
  buyOrders: { price: string; quantity: number }[];
  sellOrders: { price: string; quantity: number }[];
  bidTotal: number;
  askTotal: number;
}

interface IFundamentals {
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

interface IFinancial {
  quarter: string;
  revenue: number;
  profit: number;
  netWorth?: number;
}

interface IAbout {
  description: string;
  parentOrganisation: string;
  nseSymbol: string;
  managingDirector: string;
}

export interface IStock extends Document {
  name: string;
  price: string;
  change: string;
  image: string;
  priceHistory: IPriceHistory[];
  details: IDetails;
  marketDepth: IMarketDepth;
  fundamentals: IFundamentals;
  financials: {
    quarterly: IFinancial[];
    yearly: IFinancial[];
  };
  about: IAbout;
}

const topmarketSchema = new Schema<IStock>({
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
    events: [{ date: String, title: String, subtitle: String, amount: String, link: String }],
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

const Topmarket: Model<IStock> = mongoose.models.Topmarket || mongoose.model<IStock>('Topmarket', topmarketSchema);

export default Topmarket;
