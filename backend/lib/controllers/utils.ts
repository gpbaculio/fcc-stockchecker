import Stock from '../models/Stock';

const axios = require('axios');

interface stockArgs {
  symbol: string;
  ipAddress: string;
  like: boolean;
  type: 'single' | 'double';
  secondSymbol?: string;
}

export const saveStock = async symbol => {
  const stock = await Stock.create({
    symbol: symbol.toLowerCase()
  });
  return stock;
};

export const pushIpAndLike = (symbol, totalLikes, ipAddress) => {
  return Stock.findOneAndUpdate(
    { symbol: symbol.toLowerCase() },
    {
      $set: { totalLikes: totalLikes + 1 },
      $push: { likersIp: ipAddress }
    },
    { new: true }
  );
};

export const filterIpAndUnlike = (symbol, totalLikes, likersIp, ipAddress) => {
  return Stock.findOneAndUpdate(
    { symbol: symbol.toLowerCase() },
    {
      $set: {
        totalLikes: totalLikes - 1,
        likersIp: likersIp.filter(iAdd => iAdd !== ipAddress)
      }
    },
    { new: true }
  );
};

export const getStockData = async ({
  symbol,
  ipAddress,
  like,
  type,
  secondSymbol
}: stockArgs) => {
  const stockPrice = await axios
    .get(process.env.STOCK_API_BASE_URL_QUERY, {
      params: {
        function: process.env.STOCK_API_FUNCTION,
        symbol,
        apikey: process.env.STOCK_API_KEY
      }
    })
    .then(({ data: { 'Global Quote': globalQuote } }) =>
      Number(globalQuote['05. price'])
    );
  let stock = await Stock.findOne({ symbol: symbol.toLowerCase() });
  if (!stock) {
    stock = await saveStock(symbol);
  }
  if (!stock.likersIp.includes(ipAddress) && like) {
    stock = await pushIpAndLike(symbol, stock.totalLikes, ipAddress);
  } else if (stock.likersIp.includes(ipAddress) && like) {
    stock = await filterIpAndUnlike(
      symbol,
      stock.totalLikes,
      stock.likersIp,
      ipAddress
    );
  }
  if (type === 'single')
    return {
      stock: symbol,
      price: stockPrice,
      likes: stock.totalLikes
    };
  if (type === 'double') {
    let secondStock = await Stock.findOne({
      symbol: secondSymbol.toLowerCase()
    });
    if (!secondStock) {
      secondStock = await saveStock(symbol);
    }
    if (!secondStock.likersIp.includes(ipAddress) && like) {
      secondStock = await pushIpAndLike(
        symbol,
        secondStock.totalLikes,
        ipAddress
      );
    } else if (secondStock.likersIp.includes(ipAddress) && like) {
      secondStock = await filterIpAndUnlike(
        symbol,
        secondStock.totalLikes,
        secondStock.likersIp,
        ipAddress
      );
    }
    return {
      stock: symbol,
      price: stockPrice,
      rel_likes: stock.totalLikes - secondStock.totalLikes
    };
  }
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
