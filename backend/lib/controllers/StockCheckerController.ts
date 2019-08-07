import { Request, Response } from 'express';
import Stock, { StockDocument } from '../models/Stock';

export default class ProjectController {
  public getStockData = (req: Request, res: Response) => {
    console.log('req query ', req.query);
  };
}
