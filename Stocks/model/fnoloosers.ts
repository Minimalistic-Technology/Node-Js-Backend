export interface IPriceHistory {
  date: string;
  price: number;
}

export interface IPerformance {
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

export interface INewsItem {
  source: string;
  timestamp: string;
  headline: string;
  highlight: boolean;
}

export interface IDetails {
  performance: IPerformance;
  events: string[];
  news: INewsItem[];
}

export interface IMarketDepth {
  buyOrderQuantity: number;
  sellOrderQuantity: number;
  buyOrders: { price: string; quantity: number }[];
  sellOrders: { price: string; quantity: number }[];
  bidTotal: number;
  askTotal: number;
}

export interface IFundamentals {
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

export interface IQuarterlyData {
  quarter: string;
  revenue: number;
  profit: number;
  netWorth?: number;
}

export interface IYearlyData {
  quarter: string;
  revenue: number;
  profit: number;
}

export interface IFinancials {
  quarterly: IQuarterlyData[];
  yearly: IYearlyData[];
}

export interface IAbout {
  description: string;
  parentOrganisation: string;
  nseSymbol: string;
  managingDirector: string;
}

export interface IFNOLooser {
  name: string;
  icon: string;
  price: string;
  change: string;
  volume: string;
  priceHistory: IPriceHistory[];
  details: IDetails;
  marketDepth: IMarketDepth;
  fundamentals: IFundamentals;
  financials: IFinancials;
  about: IAbout;
}
