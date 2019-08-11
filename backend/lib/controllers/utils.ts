const axios = require('axios');

export const getStockPrice = async (symbol: string) => {
  const stockPrice = await axios
    .get(process.env.STOCK_API_BASE_URL_QUERY, {
      params: {
        function: process.env.STOCK_API_FUNCTION,
        symbol,
        apikey: process.env.STOCK_API_KEY
      }
    })
    .then(({ data: { 'Global Quote': globalQuote } }) => {
      console.log('globalQuote ', globalQuote['05. price']);
      return globalQuote['05. price'];
    });
  console.log('stockPrice ', stockPrice);
  return {
    stock: symbol,
    price: stockPrice
  };
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
