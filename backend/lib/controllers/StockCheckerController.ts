import { Request, Response } from 'express';
import Stock, { StockDocument } from '../models/Stock';
import { getStockPrice, getStockInfo } from './utils';

export default class ProjectController {
  public getStockData = async (req: Request, res: Response) => {
    const { stock } = req.query;
    if (!Array.isArray(stock)) {
      const stockPrice = await getStockPrice(stock);
      res.json(stockPrice);
    }
  };
  public getStockInfo = async (req: Request, res: Response) => {
    const { stock } = req.query;
    const stockInfo = await getStockInfo(stock);
    res.json(stockInfo);
  };
}