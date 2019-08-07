import { Request, Response } from 'express';
import Stock, { StockDocument } from '../models/Stock';

export default class ProjectController {
  public getProject = (req: Request, res: Response) => {
    const { like } = req.query;
    // Project.find(
    //   { project_name: { $regex: project_name, $options: 'i' } },
    //   'project_name',
    //   (error, issues) => {
    //     if (error) res.status(500).send(error.message);
    //     res.json({ issues });
    //   }
    // );
  };
}
