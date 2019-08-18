import { Request, Response } from 'express';
import { getStockData, getStockInfo, searchSymbol } from './utils';

export default class ProjectController {
  public getStockData = async (req: Request, res: Response) => {
    const { stock, like } = req.query;
    const likeBool = like && like === 'true' ? true : false;
    const ipAddress = req.ip;
    if (!Array.isArray(stock)) {
      const stockData = await getStockData({
        symbol: stock,
        ipAddress,
        like: likeBool,
        type: 'single'
      });
      console.log('stockData single ', stockData);
      res.json({ stockData });
    } else {
      let [firstSymBol, secondSymbol] = stock;
      firstSymBol = await getStockData({
        symbol: firstSymBol,
        ipAddress,
        like: likeBool,
        type: 'double',
        secondSymbol
      });
      secondSymbol = await getStockData({
        symbol: secondSymbol,
        ipAddress,
        like: likeBool,
        type: 'double',
        secondSymbol: firstSymBol.stock
      });
      const stockData = [firstSymBol, secondSymbol];
      console.log('stockData double ', stockData);
      res.json({ stockData });
    }
  };
  public getStockInfo = async (req: Request, res: Response) => {
    const { stock } = req.query;
    const stockInfo = await getStockInfo(stock);
    res.json(stockInfo);
  };
  public getSymbol = async (req: Request, res: Response) => {
    const { keywords } = req.query;
    const matches = await searchSymbol(keywords);
    res.json({ matches });
  };
}
