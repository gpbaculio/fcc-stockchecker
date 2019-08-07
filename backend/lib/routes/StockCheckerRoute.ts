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
    app.route('/api/stock-info').get(this.stockCheckerController.getStockInfo);
  };
}
