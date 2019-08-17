import { Request, Response } from 'express';
import Stock, { StockDocument } from '../models/Stock';
import { getStockPrice, getStockInfo, searchSymbol } from './utils';

export default class ProjectController {
  public getStockData = async (req: Request, res: Response) => {
    const { stock, like } = req.query;
    console.log('like ', like);
    const ipAddress = req.ip;
    if (!Array.isArray(stock)) {
      const stockPrice = await getStockPrice(stock, ipAddress);
      res.json(stockPrice);
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
