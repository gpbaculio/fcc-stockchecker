/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const StockCheckerController_1 = require("../controllers/StockCheckerController");
class StockCheckerRoute {
    constructor() {
        this.stockCheckerController = new StockCheckerController_1.default();
        this.routes = (app) => {
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
}
exports.default = StockCheckerRoute;
//# sourceMappingURL=StockCheckerRoute.js.map