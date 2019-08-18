import Stock from '../models/Stock';

const axios = require('axios');

interface stockArgs {
  symbol: string;
  ipAddress: string;
  like: boolean;
}

export const saveStock = async ({ symbol, ipAddress, like }: stockArgs) => {
  let stock = await Stock.create({
    symbol
  });
  if (like) {
    stock.likersIp.push(ipAddress);
    stock.totalLikes = 1;
    stock.save();
  }
  return stock;
};

export const getStockPrice = async ({ symbol, ipAddress, like }: stockArgs) => {
  const stockPrice = await axios
    .get(process.env.STOCK_API_BASE_URL_QUERY, {
      params: {
        function: process.env.STOCK_API_FUNCTION,
        symbol,
        apikey: process.env.STOCK_API_KEY
      }
    })
    .then(
      ({ data: { 'Global Quote': globalQuote } }) => globalQuote['05. price']
    );
  let stock = await Stock.findOne({ symbol });
  if (!stock) {
    stock = await saveStock({ symbol, ipAddress, like });
  }
  if (!stock.likersIp.includes(ipAddress) && like) {
    stock.likersIp.push(ipAddress);
    stock.totalLikes = stock.totalLikes || 0 + 1;
    stock.save();
  }
  return {
    stock: symbol,
    price: stockPrice,
    likes: stock.totalLikes
  };
};
// extract ip
export const extractIp = (req, res, next) => {
  const regexLanguageAndIPAddress = /.*?(?=,)/;
  const ipAddress = JSON.stringify(
    regexLanguageAndIPAddress.exec(req.headers['x-forwarded-for'])
  ).slice(2, -2);
  res.locals.ip = ipAddress;
  next();
};
export const getStockInfo = async (symbol: string) => {
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (_key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
  const stockInfo = await axios
    .get(process.env.STOCK_API_BASE_URL_QUERY, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval: '5min',
        apikey: process.env.STOCK_API_KEY
      }
    })
    .then(({ data }) =>
      JSON.parse(JSON.stringify(data, getCircularReplacer()))
    );
  return stockInfo;
};

export const searchSymbol = async (symbol: string) => {
  const {
    data: { bestMatches }
  } = await axios.get(process.env.STOCK_API_BASE_URL_QUERY, {
    params: {
      function: 'SYMBOL_SEARCH',
      keywords: symbol,
      apikey: process.env.STOCK_API_KEY
    }
  });
  return bestMatches;
};
