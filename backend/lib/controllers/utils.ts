import Stock from '../models/Stock';
import Voter from '../models/Voter';

const axios = require('axios');

export const getStockPrice = async (symbol: string, ipAddress: string) => {
  const stockPrice = await axios
    .get(process.env.STOCK_API_BASE_URL_QUERY, {
      params: {
        function: process.env.STOCK_API_FUNCTION,
        symbol,
        apikey: process.env.STOCK_API_KEY
      }
    })
    .then(({ data: { 'Global Quote': globalQuote } }) => {
      return globalQuote['05. price'];
    });
  const likes = await Stock.findOne({ symbol });
  console.log('likes ', likes);
  return {
    stock: symbol,
    price: stockPrice,
    likes: likes || 0
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
