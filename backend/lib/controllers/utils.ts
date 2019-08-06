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
    .then(({ 'Global Quote': globalQuote }) => globalQuote['05. price']);
  return {
    stock: symbol,
    price: stockPrice
  };
};
