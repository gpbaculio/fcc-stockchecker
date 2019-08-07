/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

import StockCheckerController from '../controllers/StockCheckerController';

export default class StockCheckerRoute {
  private stockCheckerController: StockCheckerController = new StockCheckerController();
  public routes = (app): void => {
    app
      .route('/api/stock-prices')
      .get(this.stockCheckerController.getStockData);
    // .post(this.issueController.create)
    // .put(this.issueController.update)
    // .delete(this.issueController.delete);
    // app
    //   .route('/api/issues/count/:project_name')
    //   .get(this.issueController.getCount);

    // app
    //   .route('/api/issues/:project_name/:issue_id')
    //   .delete(this.issueController.delete);
  };
}
